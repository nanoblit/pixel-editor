import React, { useRef, useState, useEffect } from "react";
import getCoords from "../../../util/getCoords";
import { CanvasElement, CanvasWrapper } from "./ImageEditorStyles";

interface Props {
  images?: { [key: string]: number[] };
  resolution: number;
  colorIdx: number;
  colorMap: { [key: number]: string };
  onPixelsChanged: (pixels: number[]) => void;
  drawingPosition: { x: number; y: number };
  drawGrid: boolean;
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
  drawGrid 
}) => {
  // Browser event listeners require useRef, because they don't support state
  const pixels = useRef<number[]>([]).current;
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomLevelRef = useRef(1);
  const zoomOffsetRef = useRef(0);
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const panTimeout = useRef<NodeJS.Timeout | null>(null);

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
      const [imagePositionX, imagePositionY] = getCoords(coordStr);
      const imageOffsetX = imagePositionX - drawingPosition.x;
      const imageOffsetY = imagePositionY - drawingPosition.y;

      for (let i = 0; i < image.length; i++) {
        const x = (i % resolution) + imageOffsetX * resolution;
        const y = Math.floor(i / resolution) + imageOffsetY * resolution;

        drawPixel(image[i], x, y);
      }
    }

    // Draw pixels from currently edited image
    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      drawPixel(pixels[i], x, y);
    }

    if (drawGrid) {
      drawGridLines();
    }
    drawOutline();
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

  const drawOutline = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    const startX = Math.ceil(zoomOffsetRef.current + panOffsetRef.current.x);
    const startY = Math.ceil(zoomOffsetRef.current + panOffsetRef.current.y);
    const size = Math.ceil(resolution * ppd()); 

    ctx.strokeStyle = "#913891";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, size, size)
  }

  const drawGridLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    ctx.strokeStyle = "#595959";
    ctx.lineWidth = 2;

    // Vertical
    for (let pos = 1; pos < resolution; pos++) {
      const startX = Math.ceil(pos * ppd() + zoomOffsetRef.current + panOffsetRef.current.x);
      const startY = Math.ceil(zoomOffsetRef.current + panOffsetRef.current.y);
      const endX = Math.ceil(startX);
      const endY = Math.ceil(startY + resolution * ppd());
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY)
      ctx.stroke();
    }

    // Horizontal
    for (let pos = 1; pos < resolution; pos++) {
      const startX = Math.ceil(zoomOffsetRef.current + panOffsetRef.current.x)
      const startY = Math.ceil(pos * ppd() + zoomOffsetRef.current + panOffsetRef.current.y);
      const endX = Math.ceil(startX + resolution * ppd());
      const endY = Math.ceil(startY);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY)
      ctx.stroke();
    }
  }

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

  const setAndDrawPixelIfInBounds = (clientX: number, clientY: number) => {
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

    // Don't allow drawing out of bounds
    if (x < 0 || x >= resolution || y < 0 || y >= resolution) {
      return;
    }
    // set this pixel to currently selected color
    pixels[y * resolution + x] = colorIdx;
    drawPixel(colorIdx, x, y);
    if (drawGrid) {
      drawGridLines();
    }
    drawOutline();
  };

  const handleCanvasMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (e.button === 0) {
      // LMB
      setAndDrawPixelIfInBounds(e.clientX, e.clientY);
      setIsDrawing(() => true);
    } else if (e.button === 2) {
      // RMB
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

      setAndDrawPixelIfInBounds(currentClientX, currentClientY);
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

    if (!panTimeout.current) {
      panTimeout.current = setTimeout(() => {
        drawAllPixels();
        panTimeout.current = null;
      }, 16 /* Do this about once per frame */);
    }
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
