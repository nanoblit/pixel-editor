import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasElement, CanvasWrapper } from "./DrawingCanvasStyles";

interface Props {
  resolution: number;
}

const DrawingCanvas: React.FC<Props> = ({ resolution }) => {
  const pixels = useRef<number[]>([]).current;
  let isDrawing = useRef(false).current;
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

  const drawPixels = (canvas: HTMLCanvasElement) => {
    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      drawPixel(canvas, pixels[i], x, y);
    }
  };

  const drawPixel = (
    canvas: HTMLCanvasElement,
    color: number,
    x: number,
    y: number
  ) => {
    const ctx = canvas.getContext("2d");
    const ppd = canvas.width / resolution;

    if (!ctx) {
      return;
    }

    ctx.fillStyle = color === 0 ? "black" : "blue";
    const canvasX = Math.floor(x * ppd);
    const canvasY = Math.floor(y * ppd);

    ctx.fillRect(canvasX, canvasY, Math.ceil(ppd), Math.ceil(ppd));
  };

  const handleLoad = () => {
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    drawPixels(canvas);
  };

  const handleResize = () => {
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawPixels(canvas);
  };

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      isDrawing = true;
    }
  };

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!canvas || !ctx || !isDrawing) {
      return;
    }
    const ppd = canvas.width / resolution;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left) / ppd);
    const y = Math.floor((e.clientY - rect.top) / ppd);

    pixels[y * resolution + x] = 1;
    drawPixel(canvas, 1, x, y);
  };

  useEffect(() => {
    for (let i = 0; i < resolution * resolution; i++) {
      pixels.push(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCanvasMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      isDrawing = false;
    }
  };

  useEffect(() => {
    if (!canvas) {
      return;
    }
    window.addEventListener("load", handleLoad);
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousedown", handleCanvasMouseDown);
    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    window.addEventListener("mouseup", handleCanvasMouseUp);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleCanvasMouseDown);
      canvas.removeEventListener("mousemove", handleCanvasMouseMove);
      window.removeEventListener("mouseup", handleCanvasMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, pixels]);

  return (
    <CanvasWrapper>
      <CanvasElement ref={canvasRef}></CanvasElement>
    </CanvasWrapper>
  );
};

export default DrawingCanvas;
