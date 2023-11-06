import { Terminal } from "./component/box";
import default_config, { TerminalConfigs } from "./configs";

export { Terminal };
export { TerminalLine } from "./component/line";
export type { TerminalBoxEvents, TermnialEventsHandler } from "./component/events";

export function init() {
  customElements.define(Terminal.COMPONENT_NAME, Terminal);
}

export function createTerminal(configs: TerminalConfigs = default_config) {
  const terminal_box = document.createElement(Terminal.COMPONENT_NAME) as Terminal;
  Object.keys(configs).forEach((key) => {
    const val = configs[key];
    terminal_box.setAttribute(key, val);
  });
  return terminal_box;
}
