/// <reference types="vite/client" />

import { Terminal } from "./component/box";
import default_config, { TerminalConfigs } from "./configs";

export { Terminal };
export { TerminalLine } from "./component/line";
export type { TerminalBoxEventsName, TermnialEventsHandler, TerminalBoxEvent } from "./component/events";

export async function init() {
  return window.customElements.whenDefined(Terminal.COMPONENT_NAME);
}

export function createTerminal(configs: TerminalConfigs = default_config) {
  const terminal_box = document.createElement(Terminal.COMPONENT_NAME) as Terminal;
  Object.keys(configs).forEach((key) => {
    const val = configs[key];
    if (!val && !Number.isInteger(val)) {
      terminal_box.setAttribute(key, "");
    } else {
      terminal_box.setAttribute(key, val);
    }
  });
  return terminal_box;
}
