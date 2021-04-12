import styled from "styled-components/macro";

export const CanvasWrapper = styled.div`
  position: relative;
  width: 50%;
  margin-left: 50px;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

export const CanvasElement = styled.canvas`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
`;
