import styled from "styled-components/macro";

export const EditorWrapper = styled.div`
  width: 500px;
  height: 500px;
  margin-left: 50px
`;

export const EditorCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
`;
