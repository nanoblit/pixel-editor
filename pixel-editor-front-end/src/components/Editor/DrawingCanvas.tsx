import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasElement, CanvasWrapper } from "./DrawingCanvasStyles";

interface Props {
  resolution: number;
  colorIdx: number;
}

const DrawingCanvas: React.FC<Props> = ({ resolution, colorIdx }) => {
  const pixels = useRef<number[]>([]).current;
  let [isDrawing, setIsDrawing] = useState(false);
  const colorMap = useRef<{ [key: number]: string }>({
    0: "#c7cfa2",
    1: "#8a966d",
    2: "#4d513c",
    3: "#1c1c1c",
  }).current;
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (!node) {
      return;
    }
    setCanvas(() => node);
    const context = node.getContext("2d");
    if (context) {
      setCtx(() => context);
    }
  }, []);

  const drawPixels = () => {
    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      drawPixel(pixels[i], x, y);
    }
  };

  const drawPixel = (color: number, x: number, y: number) => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const ppd = canvas.width / resolution;

    if (!ctx) {
      return;
    }

    ctx.fillStyle = colorMap[color];
    const canvasX = Math.floor(x * ppd);
    const canvasY = Math.floor(y * ppd);

    ctx.fillRect(canvasX, canvasY, Math.ceil(ppd), Math.ceil(ppd));
  };

  const setCanvasPixelSize = () => {
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  const handleLoadAndResize = () => {
    setCanvasPixelSize();
    drawPixels();
  };

  const setAndDrawPixel = (clientX: number, clientY: number) => {
    if (!canvas) {
      return;
    }

    const ppd = canvas.width / resolution;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor((clientX - rect.left) / ppd);
    const y = Math.floor((clientY - rect.top) / ppd);

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
    setAndDrawPixel(e.clientX, e.clientY);
  };

  useEffect(() => {
    for (let i = 0; i < resolution * resolution; i++) {
      pixels.push(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCanvasMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      setIsDrawing(() => false);
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleLoadAndResize);
    window.addEventListener("resize", handleLoadAndResize);
    window.addEventListener("mouseup", handleCanvasMouseUp);

    return () => {
      window.removeEventListener("load", handleLoadAndResize);
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
