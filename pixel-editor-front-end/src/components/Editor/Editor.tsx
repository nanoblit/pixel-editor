import React, { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";

const Editor = () => {
  const [drawingColorIdx, setDrawingColorIdx] = useState(0);

  return (
    <>
      <DrawingCanvas resolution={32} colorIdx={drawingColorIdx} /> 
      <button onClick={() => setDrawingColorIdx(() => 0)}>Color 0</button>
      <button onClick={() => setDrawingColorIdx(() => 1)}>Color 1</button>
      <button onClick={() => setDrawingColorIdx(() => 2)}>Color 2</button>
      <button onClick={() => setDrawingColorIdx(() => 3)}>Color 3</button>
    </>
  );
};

export default Editor;
