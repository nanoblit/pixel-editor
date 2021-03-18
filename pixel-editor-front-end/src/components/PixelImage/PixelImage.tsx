import React, { useEffect, useState } from "react";
import { PixelImageWrapper } from "./PixelImageStyles";

interface Props {
  pixels: number[];
  resolution: number;
  colorMap: { [key: number]: string };
  size: string;
}

const PixelImage: React.FC<Props> = ({
  pixels,
  resolution,
  colorMap,
  size,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canvas, setCanvas] = useState(document.createElement("canvas"));
  const [src, setSrc] = useState("");

  useEffect(() => {
    canvas.width = resolution;
    canvas.height = resolution;

    for (let i = 0; i < pixels.length; i++) {
      const x = i % resolution;
      const y = Math.floor(i / resolution);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.fillStyle = colorMap[pixels[i]];

      ctx.fillRect(x, y, 1, 1);
    }

    setSrc(() => canvas.toDataURL());
  }, [canvas, colorMap, pixels, resolution]);

  return (
    <PixelImageWrapper
      style={{ "--size": size } as React.CSSProperties}
      alt="art"
      src={src}
    />
  );
};

export default PixelImage;
