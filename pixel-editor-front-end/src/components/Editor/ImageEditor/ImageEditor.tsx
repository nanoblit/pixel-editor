import React, { useRef, useState, useEffect } from "react";
import { CanvasElement, CanvasWrapper } from "./ImageEditorStyles";

interface Props {
  pixels?: { [key: string]: number[] };
  resolution: number;
  colorIdx: number;
  colorMap: { [key: number]: string };
  onPixelsChanged: (pixels: number[]) => void;
  drawingCanvasPosition: [number, number];
}

// Set ppd based on zoom level
// Change DrawPixel so it offsets based on pixelImage and current width based on ppd position and view offset

const ImageEditor: React.FC<Props> = ({
  resolution,
  colorIdx,
  colorMap,
  onPixelsChanged,
  drawingCanvasPosition,
}) => {
  // Browser event listeners require useRef, because they don't support state
  const pixels = useRef<number[]>([]).current;
  let [isDrawing, setIsDrawing] = useState(false);
  let zoomLevelRef = useRef(1);
  let offsetRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPixels = () => {
    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      drawPixel(pixels[i], x, y);
    }
  };

  const ppd = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return 0;
    }
    return (canvas.width / resolution) * zoomLevelRef.current;
  };

  const drawPixel = (color: number, x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    ctx.fillStyle = colorMap[color];
    const canvasX = Math.floor(x * ppd()) + offsetRef.current;
    const canvasY = Math.floor(y * ppd()) + offsetRef.current;

    ctx.fillRect(
      Math.ceil(canvasX),
      Math.ceil(canvasY),
      Math.ceil(ppd()),
      Math.ceil(ppd())
    );
  };

  const resetCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
  };

  const handleLoadAndResize = () => {
    resetCanvasSize();
    resetOffset();
    drawPixels();
  };

  const setAndDrawPixel = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    const x = Math.floor(
      (clientX - canvasRect.left - offsetRef.current) / ppd()
    );
    const y = Math.floor(
      (clientY - canvasRect.top - offsetRef.current) / ppd()
    );
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
    const length = Math.floor(
      Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY)
    );
    const stepX = e.movementX / length;
    const stepY = e.movementY / length;
    for (let i = 0; i < length; i++) {
      const currentClientX = lastClientX + stepX * i;
      const currentClientY = lastClientY + stepY * i;

      setAndDrawPixel(currentClientX, currentClientY);
    }
  };

  const handleCanvasScroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    zoomLevelRef.current -= e.deltaY / 1000;
    resetOffset();
  };

  const resetOffset = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    offsetRef.current = (-canvas.width * (zoomLevelRef.current - 1)) / 2;
    drawPixels();
  };

  const handleCanvasMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      setIsDrawing(() => false);
      if (onPixelsChanged) {
        onPixelsChanged([...pixels]);
      }
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
        onWheel={handleCanvasScroll}
      ></CanvasElement>
    </CanvasWrapper>
  );
};

export default ImageEditor;
