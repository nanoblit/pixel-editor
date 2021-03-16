import { useCallback, useEffect, useRef, useState } from "react";
import { EditorCanvas, EditorWrapper } from "./EditorStyles";

const Editor = () => {
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
  const pixels = useRef<number[]>([]).current;

  const drawPixels = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    const ppd = canvas.width / 32;

    if (!ctx) {
      return;
    }

    for (let i = 0; i < pixels.length; i++) {
      const x = i % 32;
      const y = Math.floor(i / 32);

      ctx.fillStyle = pixels[i] === 0 ? "black" : "blue";
      const canvasX = Math.floor(x * ppd);
      const canvasY = Math.floor(y * ppd);

      ctx.fillRect(canvasX, canvasY, Math.ceil(ppd), Math.ceil(ppd));
    }
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

  const handleCanvasClick = (e: MouseEvent) => {
    if (!canvas || !ctx) {
      return;
    }
    const ppd = canvas.width / 32;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left) / ppd);
    const y = Math.floor((e.clientY - rect.top) / ppd);

    pixels[y * 32 + x] = 2;
    drawPixels(canvas);
  };

  useEffect(() => {
    for (let i = 0; i < 32 * 32; i++) {
      pixels.push(0);
    }
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    window.addEventListener("load", handleLoad);
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [canvas, pixels]);

  // useEffect(() => console.log(pixels), [pixels]);

  return (
    <EditorWrapper>
      <EditorCanvas ref={canvasRef}></EditorCanvas>
    </EditorWrapper>
  );
};

export default Editor;
