import { createTerminal } from "../src/index";

function bindCallback(id: string, func: any) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", func);
  }
}

function display(data: any) {
  const str = JSON.stringify(data);
  const display = document.querySelector("#display");
  if (display) {
    display.innerHTML = str;
  }
}

function getContentById(id: string) {
  const el = document.getElementById(id) as HTMLInputElement;
  return el?.value ?? "";
}

function init() {
  const terminal_box = createTerminal();
  const container = document.querySelector(".container");
  container?.appendChild(terminal_box);
  return terminal_box;
}

const box = init();

bindCallback("create-input", () => {
  box.createInput();
});

bindCallback("response", () => {
  box.createRespond();
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
  );
});

bindCallback("change-title", () => {
  box.setAttribute("start_word", getContentById("start-word"));
});
