import { useEffect, useRef, useState } from "react";
import { EditorCanvas, EditorWrapper } from "./EditorStyles";

const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<number[]>([]);

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
      const canvasX = x * ppd;
      const canvasY = y * ppd;
      console.log(canvasX);
      ctx.fillRect(canvasX, canvasY, ppd, ppd);
    }
  };

  const handleLoad = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;

    drawPixels(canvas);
  };

  const handleResize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;

    console.log(pixels);
    drawPixels(canvas);
  };

  const handleCanvasClick = () => {
    const ppd = canvas.width / 32;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "blue";
    const x = Math.round((e.clientX - rect.left) / ppd);
    const y = Math.round((e.clientY - rect.top) / ppd);
    console.log(`x: ${x}, y: ${y}`);

    // setPixels((prev) => {
    //   prev
    // })

    // drawPixels(canvas);
  };

  useEffect(() => {
    setPixels(() => {
      const newPixels: number[] = [];
      for (let i = 0; i < 32 * 32; i++) {
        newPixels.push(0);
      }
      return newPixels;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
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
  }, [pixels]);

  useEffect(() => console.log(pixels), [pixels]);

  return (
    <EditorWrapper>
      <EditorCanvas ref={canvasRef}></EditorCanvas>
    </EditorWrapper>
  );
};

export default Editor;
