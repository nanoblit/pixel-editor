import React from 'react';
import GlobalStyle from "./styles/globalStyles";

import Editor from "./components/Editor/Editor";

const App = () => {
  return (
    <div className="App">
      <GlobalStyle />
      <Editor />
    </div>
  );
}

export default App;
