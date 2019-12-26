import React from "react";
import ReactDOM from "react-dom";
import "reflect-metadata";

import PhaserComponent from "./components/PhaserComponent";
import TitleComponent from "./components/TitleComponent";

ReactDOM.render(
  [
    <TitleComponent title="Look Ma I Made A Bideo Game" />,
    <PhaserComponent minWidth="800" minHeight="600" maxWidth="1200" maxHeight="800" />
  ],
  document.getElementById("root") || document.createElement("div")
);
