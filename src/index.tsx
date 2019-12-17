import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import PhaserComponent from "./components/PhaserComponent";
import TitleComponent from "./components/TitleComponent";
import playGame from "./phaser/scene";

//console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 800,
  height: 600,
  scene: playGame
};

const game = new Phaser.Game(config);

ReactDOM.render(
  [
    <TitleComponent title="Look Ma I Made A Bideo Game" />,
    <PhaserComponent id="phaser" />
  ],
  document.getElementById("root") || document.createElement("div")
);
