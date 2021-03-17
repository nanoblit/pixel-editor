import React, { useEffect, useState } from "react";

interface Props {
  pixels: number[];
  resolution: number;
  colorMap: { [key: number]: string };
}

const PixelImage: React.FC<Props> = ({ pixels, resolution, colorMap }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canvas, setCanvas] = useState(document.createElement("canvas"));

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
  }, [canvas, colorMap, pixels, resolution]);

  return <></>;
};

export default PixelImage;
