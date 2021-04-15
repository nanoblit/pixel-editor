import React, { useRef, useState, useEffect } from "react";
import { CanvasElement, CanvasWrapper } from "./ImageEditorStyles";

interface Props {
  images?: { [key: string]: number[] };
  resolution: number;
  colorIdx: number;
  colorMap: { [key: number]: string };
  onPixelsChanged: (pixels: number[]) => void;
  drawingPosition: [number, number];
}

// Make drawAllPixels also draw things from images around the drawingPosition
//  Find position for each image based on drawingPosition ()


const ImageEditor: React.FC<Props> = ({
  images = {},
  resolution,
  colorIdx,
  colorMap,
  onPixelsChanged,
  drawingPosition,
}) => {
  // Browser event listeners require useRef, because they don't support state
  const pixels = useRef<number[]>([]).current;
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  let zoomLevelRef = useRef(1);
  let zoomOffsetRef = useRef(0);
  let panOffsetRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawAllPixels = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    ctx.fillStyle = colorMap[3];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each image
    for (const [coordStr, image] of Object.entries(images)) {

    }

    // Draw pixels from currently edited image
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
    const canvasX =
      Math.floor(x * ppd()) + zoomOffsetRef.current + panOffsetRef.current.x;
    const canvasY =
      Math.floor(y * ppd()) + zoomOffsetRef.current + panOffsetRef.current.y;

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
    drawAllPixels();
  };

  const setAndDrawPixel = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    const x = Math.floor(
      (clientX -
        canvasRect.left -
        zoomOffsetRef.current -
        panOffsetRef.current.x) /
        ppd()
    );
    const y = Math.floor(
      (clientY -
        canvasRect.top -
        zoomOffsetRef.current -
        panOffsetRef.current.y) /
        ppd()
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
    } else if (e.button === 2) {
      e.preventDefault();
      setIsPanning(() => true);
    }
  };

  const handleCanvasMouseMoveWhenDrawing = (
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

  const handleCanvasMouseMoveWhenPanning = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isPanning) {
      return;
    }
    panOffsetRef.current.x += e.movementX;
    panOffsetRef.current.y += e.movementY;
    drawAllPixels();
  };

  const handleCanvasMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    handleCanvasMouseMoveWhenDrawing(e);
    handleCanvasMouseMoveWhenPanning(e);
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

    zoomOffsetRef.current = (-canvas.width * (zoomLevelRef.current - 1)) / 2;
    drawAllPixels();
  };

  const handleCanvasMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      setIsDrawing(() => false);
      if (onPixelsChanged) {
        onPixelsChanged([...pixels]);
      }
    } else if (e.button === 2) {
      setIsPanning(() => false);
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Fill pixels with the darkest color
    for (let i = 0; i < resolution * resolution; i++) {
      pixels.push(3);
    }

    const canvas = canvasRef.current;

    handleLoadAndResize();

    window.addEventListener("resize", handleLoadAndResize);
    window.addEventListener("mouseup", handleCanvasMouseUp);
    canvas?.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("resize", handleLoadAndResize);
      window.removeEventListener("mouseup", handleCanvasMouseUp);
      canvas?.removeEventListener("contextmenu", handleContextMenu);
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
