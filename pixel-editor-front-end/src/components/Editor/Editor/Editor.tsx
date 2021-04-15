import React, { useState } from "react";
import { colorMap } from "../../../data/colorMaps";
import PixelImage from "../../PixelImage/PixelImage";
import ColorButton from "../ColorButton/ColorButton";
import ImageEditor from "../ImageEditor/ImageEditor";

const Editor = () => {
  const [drawingColorIdx, setDrawingColorIdx] = useState(0);
  const [pixels, setPixels] = useState<{ [key: string]: number[] }>({});

  const handlePixelsChange = (newPixels: number[]) => {
    // setPixels(() => newPixels);
  };

  const handleSave = () => {};

  return (
    <>
      <ImageEditor
        resolution={32}
        colorIdx={drawingColorIdx}
        colorMap={colorMap}
        onPixelsChanged={handlePixelsChange}
        drawingPosition={[1, 0]}
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
      {/* {pixels.length > 0 && (
        <PixelImage
          colorMap={colorMap}
          pixels={pixels}
          resolution={32}
          size="10rem"
        />
      )} */}
    </>
  );
};

export default Editor;
