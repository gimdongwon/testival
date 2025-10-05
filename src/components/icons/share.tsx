import ShareSvg from 'public/images/quiz/common/share.svg';

type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export default function ShareIcon({
  color = '#000',
  width = 24,
  height = 24,
}: Props) {
  return <ShareSvg width={width} height={height} style={{ color }} />;
}
