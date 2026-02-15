#!/usr/bin/env node
/**
 * Figma Design Extractor
 * Extracts UI design tokens (colors, typography, spacing, etc.) from a Figma node
 * 
 * Usage: FIGMA_ACCESS_TOKEN=your_token node scripts/figma-extract-design.js
 * Get token: Figma account > Settings > Personal access tokens
 */

const FIGMA_FILE_KEY = 'beJAAoFDBWTK3VAxBj8alD';
const NODE_ID = '567-712'; // Convert to 567:712 for API
const API_BASE = 'https://api.figma.com/v1';

async function fetchFigmaNode() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error('Error: Set FIGMA_ACCESS_TOKEN env var. Get it from Figma > Settings > Personal access tokens');
    process.exit(1);
  }

  const nodeIdFormatted = NODE_ID.replace('-', ':');
  const url = `${API_BASE}/files/${FIGMA_FILE_KEY}?ids=${encodeURIComponent(nodeIdFormatted)}&geometry=paths`;
  
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Figma API error ${res.status}: ${err}`);
  }

  return res.json();
}

// Convert Figma color (0-1) to hex
function figmaColorToHex(color) {
  if (!color) return null;
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  const a = color.a !== undefined ? Math.round(color.a * 255) : 255;
  const hex = [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  return a < 255 ? `#${hex}${a.toString(16).padStart(2, '0')}` : `#${hex}`;
}

// Recursively extract design tokens from a node tree
function extractDesignData(node, path = '') {
  const result = {
    colors: [],
    typography: [],
    strokes: [],
    effects: [],
    layout: [],
    rawNodes: []
  };

  function visit(n, p) {
    if (!n) return;
    
    const nodePath = p ? `${p} > ${n.name}` : n.name;
    const nodeInfo = {
      id: n.id,
      name: n.name,
      type: n.type,
      path: nodePath
    };

    // Fills (background colors)
    if (n.fills && Array.isArray(n.fills)) {
      for (const fill of n.fills) {
        if (fill.visible === false) continue;
        if (fill.type === 'SOLID' && fill.color) {
          const hex = figmaColorToHex(fill.color);
          const opacity = fill.opacity !== undefined ? fill.opacity : 1;
          if (hex && !result.colors.find(c => c.hex === hex && c.opacity === opacity)) {
            result.colors.push({
              hex,
              opacity,
              source: nodePath,
              nodeId: n.id,
              rgba: fill.color
            });
          }
        }
      }
    }

    // Strokes
    if (n.strokes && Array.isArray(n.strokes)) {
      for (const stroke of n.strokes) {
        if (stroke.visible === false) continue;
        if (stroke.type === 'SOLID' && stroke.color) {
          const hex = figmaColorToHex(stroke.color);
          if (hex) {
            result.strokes.push({
              hex,
              weight: n.strokeWeight ?? n.strokeWeights?.[0],
              source: nodePath,
              nodeId: n.id
            });
          }
        }
      }
    }

    // Typography
    if (n.style) {
      const style = n.style;
      const typo = {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeightPx ?? style.lineHeightPercent,
        letterSpacing: style.letterSpacing,
        textAlignHorizontal: style.textAlignHorizontal,
        textAlignVertical: style.textAlignVertical,
        source: nodePath,
        nodeId: n.id,
        text: n.characters?.substring?.(0, 50)
      };
      if (typo.fontFamily || typo.fontSize) {
        result.typography.push(typo);
      }
    }

    // Effects (shadows, blurs)
    if (n.effects && Array.isArray(n.effects)) {
      for (const eff of n.effects) {
        if (eff.visible === false) continue;
        result.effects.push({
          type: eff.type,
          radius: eff.radius,
          offset: eff.offset,
          color: eff.color ? figmaColorToHex(eff.color) : null,
          source: nodePath,
          nodeId: n.id
        });
      }
    }

    // Layout & sizing
    if (n.absoluteBoundingBox || n.cornerRadius !== undefined) {
      result.layout.push({
        ...nodeInfo,
        width: n.absoluteBoundingBox?.width,
        height: n.absoluteBoundingBox?.height,
        x: n.absoluteBoundingBox?.x,
        y: n.absoluteBoundingBox?.y,
        cornerRadius: n.cornerRadius ?? n.rectangleCornerRadii,
        paddingLeft: n.paddingLeft,
        paddingRight: n.paddingRight,
        paddingTop: n.paddingTop,
        paddingBottom: n.paddingBottom
      });
    }

    result.rawNodes.push({
      ...nodeInfo,
      type: n.type,
      fills: n.fills,
      strokes: n.strokes,
      style: n.style,
      effects: n.effects,
      cornerRadius: n.cornerRadius
    });

    if (n.children && Array.isArray(n.children)) {
      for (const child of n.children) {
        visit(child, nodePath);
      }
    }
  }

  visit(node, '');
  return result;
}

function printSummary(data) {
  console.log('\n=== FIGMA DESIGN EXTRACTION - RAW OUTPUT ===\n');
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  try {
    const json = await fetchFigmaNode();
    const nodes = json.nodes;
    
    if (!nodes || Object.keys(nodes).length === 0) {
      console.error('No nodes found. Check that node-id 567-712 exists and is accessible.');
      process.exit(1);
    }

    const nodeData = Object.values(nodes)[0];
    const node = nodeData?.document;
    
    if (!node) {
      console.error('Could not find document in response:', JSON.stringify(json, null, 2));
      process.exit(1);
    }

    const designData = extractDesignData(node);

    // Deduplicate and organize
    const output = {
      meta: {
        fileKey: FIGMA_FILE_KEY,
        nodeId: NODE_ID,
        nodeName: node.name,
        extractedAt: new Date().toISOString()
      },
      colors: designData.colors,
      typography: [...new Map(designData.typography.map(t => [t.fontFamily + t.fontSize + t.fontWeight, t])).values()],
      strokes: designData.strokes,
      effects: designData.effects,
      layout: designData.layout,
      rawNodes: designData.rawNodes
    };

    printSummary(output);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
