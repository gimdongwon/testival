// src/types/svg.d.ts  (경로는 아무 곳이나 OK, tsconfig "include"에 포함)
declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}
