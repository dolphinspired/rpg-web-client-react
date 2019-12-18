import React from "react";

import playGame from "../phaser/scene";

type PhaserProps = {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

let idCounter = 0;

function parseIntOrDefault(val: string | undefined, def: number): number {
  if (val === undefined || val === "") {
    return def;
  }

  var int = parseInt(val, 10);
  if (isNaN(int)) {
    return def;
  }

  return int;
}

function clamp(val: number, min: number, max: number) {
  return val < min ? min : val > max ? max : val;
}

export default class App extends React.Component<PhaserProps> {
  private containerId: string;
  private game?: Phaser.Game;

  constructor(props: PhaserProps) {
    super(props);
    this.containerId = `phaser-container-${++idCounter}`;
  }
	render() {
		return (
			<div id={this.containerId}></div>
		);
  }
  componentDidMount() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: this.containerId,
      width: this.props.width,
      height: this.props.height,
      scene: playGame,
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);
    window.addEventListener('resize', (event) => this.resize());
    window.setTimeout(() => this.resize(), 0); // Game canvas not available until next frame
  }
  componentWillUnmount() {

  }
  // Adapted from: https://github.com/yandeu/phaser3-scaling-resizing-example/blob/master/src/scripts/game.ts#L36
  private resize() {
    if (!this.game || !this.game.canvas) {
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    const targetWidth = parseIntOrDefault(this.props.width, w);
    const targetHeight = parseIntOrDefault(this.props.height, h);
    const maxWidth = parseIntOrDefault(this.props.maxWidth, targetWidth);
    const maxHeight = parseIntOrDefault(this.props.maxHeight, targetHeight);
    const minWidth = parseIntOrDefault(this.props.minWidth, targetWidth);
    const minHeight = parseIntOrDefault(this.props.minHeight, targetHeight);

    const oldWidth = this.game.scale.width;
    const oldHeight = this.game.scale.height;
    const newWidth = clamp(targetWidth, minWidth, maxWidth);
    const newHeight = clamp(targetHeight, minHeight, maxHeight);

    const changed = oldWidth !== newWidth || oldHeight !== newHeight;
    if (changed) {
      this.game.scale.resize(newWidth, newHeight);
      // console.log(`Game resized to ${newWidth}x${newHeight}`);
    }
  }
}
