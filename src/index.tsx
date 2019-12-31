import React from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';

import { PhaserComponent, TitleComponent } from './components';

import * as di from './di';
import * as s from './services';

ReactDOM.render(
  [
    <TitleComponent title="Look Ma I Made A Bideo Game" />,
    <PhaserComponent minWidth="800" minHeight="600" maxWidth="1200" maxHeight="800" />
  ],
  document.getElementById("root") || document.createElement("div")
);

function startup() {
  const container = di.registerAppServices();
  di.getResolvedCommandControllers(container).forEach(controller => {
    controller.initHandlers(container.get<s.CommandService>(di.tokens.cmd))
  });
}

startup();