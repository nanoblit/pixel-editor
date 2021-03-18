import React, { useState } from "react";
import PixelImage from "../../PixelImage/PixelImage";
import ColorButton from "../ColorButton/ColorButton";
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas";

const Editor = () => {
  const [drawingColorIdx, setDrawingColorIdx] = useState(0);
  const [pixels, setPixels] = useState<number[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: number]: string }>({
    0: "#c7cfa2",
    1: "#8a966d",
    2: "#4d513c",
    3: "#1c1c1c",
  });

  const handlePixelsChange = (newPixels: number[]) => {
    setPixels(() => newPixels);
    console.log(newPixels);
    console.log(pixels);
  };

  const handleSave = () => {};

  console.log(pixels);
  return (
    <>
      <DrawingCanvas
        resolution={32}
        colorIdx={drawingColorIdx}
        colorMap={colorMap}
        onPixelsChanged={handlePixelsChange}
      />
      {[0, 1, 2, 3].map((idx) => (
        <ColorButton
          key={idx}
          color={colorMap[idx]}
          selected={drawingColorIdx === idx}
          onClick={() => setDrawingColorIdx(() => idx)}
        />
      ))}
      <button onClick={handleSave}>Save</button>
      {pixels.length > 0 && (
        <PixelImage
          colorMap={colorMap}
          pixels={pixels}
          resolution={32}
          size="10rem"
        />
      )}
    </>
  );
};

export default Editor;
