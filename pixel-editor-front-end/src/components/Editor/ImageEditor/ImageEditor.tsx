interface Props {
  pixels?: {[key:string]: number[]};
  resolution: number;
  colorIdx: number;
  colorMap: { [key: number]: string };
  onPixelsChanged: (pixels: number[]) => void;
  drawingCanvasPosition: [number, number];
}

const ImageEditor: React.FC<Props> = () => {
  return <p>Hello</p>;
};

export default ImageEditor;
