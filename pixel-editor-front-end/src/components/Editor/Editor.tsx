import { useEffect, useRef } from "react";

const Editor = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }
    const ctx = canvas.current.getContext("2d"); 

    ctx?.fillRect(0, 0, canvas.current.width, canvas.current.height);
  }, []);

  return (
    <div>
      <canvas
        ref={canvas}
        style={{ display: "block", width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
};

export default Editor;
