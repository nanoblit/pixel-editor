import { createGlobalStyle } from "styled-components/macro";

import reset from "./reset";
import { setSizing } from "./setSizing";

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${setSizing}
  body, button, textarea  {
    /* Font and color */
  }
`;

export default GlobalStyle;
