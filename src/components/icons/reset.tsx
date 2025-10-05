import ResetSvg from 'public/images/quiz/common/reset.svg';

type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export default function ResetIcon({
  color = '#000',
  width = 24,
  height = 24,
}: Props) {
  return <ResetSvg width={width} height={height} style={{ color }} />;
}
