import { fireEvent, render, screen } from "@testing-library/react";
import Editor from "../Editor/Editor";

describe("Editor", () => {
  test("drawing works", () => {
    render(<Editor />);

    const canvas = screen.getByRole("canvas") as HTMLCanvasElement;

    fireEvent(
      canvas,
      new MouseEvent("click", {
        clientX: canvas.clientLeft + 1,
        clientY: canvas.clientTop + 1,
      })
    );
  });
});
