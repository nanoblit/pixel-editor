import { createGlobalStyle } from "styled-components/macro";

import reset from "./reset";
import { setSizing } from "./setSizing";

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${setSizing}
  /* @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap'); */
  body, button, textarea  {
    /* Font and color */
  }
`;

export default GlobalStyle;
