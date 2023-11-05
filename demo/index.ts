import { TerminalBox } from "../src/index";

(function () {
  const terminal_box = document.createElement(TerminalBox.COMPONENT_NAME);
  const container = document.querySelector(".container");
  container?.appendChild(terminal_box);
})();
