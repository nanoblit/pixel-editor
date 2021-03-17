import React from "react";
import { RoundButton } from "./ColorButtonStyles";

interface Props {
  color: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selected?: boolean;
}

const ColorButton: React.FC<Props> = ({ color, onClick, selected = false }) => {
  return (
    <RoundButton
      className={selected ? "selected" : ""}
      style={{ "--color": color } as React.CSSProperties}
      onClick={onClick}
    ></RoundButton>
  );
};

export default ColorButton;
