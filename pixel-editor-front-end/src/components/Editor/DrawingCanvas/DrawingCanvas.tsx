import { useEffect, useRef, useState } from "react";
import { CanvasElement, CanvasWrapper } from "./DrawingCanvasStyles";

interface Props {
  resolution: number;
  colorIdx: number;
  colorMap: { [key: number]: string };
  onPixelsChanged: (pixels: number[]) => void;
}

const DrawingCanvas: React.FC<Props> = ({ 
  resolution,
  colorIdx,
  colorMap,
  onPixelsChanged,
}) => {
  const pixels = useRef<number[]>([]).current;
  let [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPixels = () => {
    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      drawPixel(pixels[i], x, y);
    }
  };

  const drawPixel = (color: number, x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    const ppd = canvas.width / resolution;

    ctx.fillStyle = colorMap[color];
    const canvasX = Math.floor(x * ppd);
    const canvasY = Math.floor(y * ppd);

    ctx.fillRect(canvasX, canvasY, Math.ceil(ppd), Math.ceil(ppd));
  };

  const setCanvasPixelSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
  };

  const handleLoadAndResize = () => {
    setCanvasPixelSize();
    drawPixels();
  };

  const setAndDrawPixel = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ppd = canvas.width / resolution;
    const canvasRect = canvas.getBoundingClientRect();

    const x = Math.floor((clientX - canvasRect.left) / ppd);
    const y = Math.floor((clientY - canvasRect.top) / ppd);

    // set this pixel to currently selected color
    pixels[y * resolution + x] = colorIdx;
    drawPixel(colorIdx, x, y);
  };

  const handleCanvasMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (e.button === 0) {
      setAndDrawPixel(e.clientX, e.clientY);
      setIsDrawing(() => true);
    }
  };

  const handleCanvasMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) {
      return;
    }

    // Draw on every pixel from last to current position (to avoid gaps)
    const lastClientX = e.clientX - e.movementX;
    const lastClientY = e.clientY - e.movementY;
    const length = Math.floor(Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY));
    const stepX = e.movementX / length;
    const stepY = e.movementY / length;
    for(let i = 0; i < length; i++) {
      const currentClientX = lastClientX + stepX * i;
      const currentClientY = lastClientY + stepY * i;

      setAndDrawPixel(currentClientX, currentClientY);
    }
    
  };

  const handleCanvasMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      setIsDrawing(() => false);
      onPixelsChanged(pixels);
    }
  };

  useEffect(() => {
    for (let i = 0; i < resolution * resolution; i++) {
      pixels.push(3);
    }

    handleLoadAndResize();

    window.addEventListener("resize", handleLoadAndResize);
    window.addEventListener("mouseup", handleCanvasMouseUp);

    return () => {
      window.removeEventListener("resize", handleLoadAndResize);
      window.removeEventListener("mouseup", handleCanvasMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CanvasWrapper>
      <CanvasElement
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
      ></CanvasElement>
    </CanvasWrapper>
  );
};

export default DrawingCanvas;
