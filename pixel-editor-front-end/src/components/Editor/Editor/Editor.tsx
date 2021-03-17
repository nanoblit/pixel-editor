import React, { useState } from "react";
import ColorButton from "../ColorButton/ColorButton";
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas";

const Editor = () => {
  const [drawingColorIdx, setDrawingColorIdx] = useState(0);

  return (
    <>
      <DrawingCanvas resolution={32} colorIdx={drawingColorIdx} />
      <ColorButton
        color="#c7cfa2"
        selected={drawingColorIdx === 0}
        onClick={() => setDrawingColorIdx(() => 0)}
      />
      <ColorButton
        color="#8a966d"
        selected={drawingColorIdx === 1}
        onClick={() => setDrawingColorIdx(() => 1)}
      />
      <ColorButton
        color="#4d513c"
        selected={drawingColorIdx === 2}
        onClick={() => setDrawingColorIdx(() => 2)}
      />
      <ColorButton
        color="#1c1c1c"
        selected={drawingColorIdx === 3}
        onClick={() => setDrawingColorIdx(() => 3)}
      />
    </>
  );
};

export default Editor;
