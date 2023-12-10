import { Terminal, createTerminal } from "../src/index";
import { bindCallback, getContentById, display } from "./utils";

function insertTerminal() {
  const terminal_box = createTerminal();
  const container = document.querySelector(".container");
  container?.appendChild(terminal_box);
  return terminal_box;
}

const boxs = document.querySelectorAll(Terminal.COMPONENT_NAME);

boxs.forEach((box: Terminal, index: number) => {
  box.addEventListener("input-finish", (evt) => {
    display(`Input end: ${evt.data}`, index);
    if (evt.data === "yaonian") {
      box.createRespond(["wow", "he is lol master", "better than <span style='color:red;'>Faker</span>"]);
    }
  });

  box.addEventListener("start-typing", () => {
    display("typing", index);
  });
  box.addEventListener("typing-finish", () => {
    display("typing finish", index);
  });

  bindCallback("create-input", () => {
    box.createInput();
  });

  bindCallback("create-response", () => {
    box.createRespond(new Array(10).fill(getContentById("response")));
  });

  bindCallback("clear", () => {
    box.clear();
  });

  bindCallback("get-content", () => {
    const data = box.getRecords();
    display(
      data.map((v) => {
        delete v.type_instance;
        return v;
      }),
      index,
    );
  });

  bindCallback("change-title", () => {
    box.setAttribute("start_word", getContentById("start-word"));
  });
});

insertTerminal();
