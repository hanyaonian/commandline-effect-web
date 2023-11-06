import { WebComponent } from "@/type.d";
import { TerminalLine } from "./line";
import { CustomEvents, TerminalBoxEvents } from "./events";
import keyboardJS from "keyboardjs";
import dom from "@/assets/dom.html?raw";
import box_style from "@/assets/scss/terminal-box.scss?inline";
import scanline_style from "@/assets/scss/scanline.scss?inline";
import default_config, { type TerminalConfigs } from "@/configs";

export class Terminal extends WebComponent {
  static COMPONENT_NAME = "terminal-box";
  static TEMPLATE_ID = "terminal-box";

  public records: {
    id: number;
    messge: string;
    type: "input" | "respond";
    el: HTMLElement;
    type_instance: TerminalLine;
  }[] = [];

  public scanline: boolean = default_config.scanline;
  public speed: number = default_config.speed;
  public start_word: string = default_config.start_word;

  public input_status: "input" | "responding" | "idle" = "idle";

  private input_span: HTMLSpanElement;
  private msg_id: number = 0;

  private _current_line: HTMLDivElement;
  private _current_box: TerminalLine;
  private _style_el = document.createElement("style");

  static get observedAttributes() {
    return ["start_word"];
  }

  constructor() {
    super();
    this.bindKeyBoard();
  }

  connectedCallback() {
    this.initDom();
  }

  disconnectedCallback() {
    console.log("disconnectedCallback");
  }

  adoptedCallback() {
    console.log("adoptedCallback");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (Terminal.observedAttributes.includes(name)) {
      this[name] = newValue;
    }
    console.log("attributeChangedCallback: ", name, oldValue, newValue);
  }

  getRecords() {
    return this.records;
  }

  private initDom() {
    this.attachShadow({ mode: "open" });
    // init template
    let template_el = document.getElementById(Terminal.TEMPLATE_ID) as HTMLTemplateElement | null;
    if (!template_el?.content) {
      template_el = document.createElement("template");
      template_el.setAttribute("id", Terminal.TEMPLATE_ID);
      template_el.innerHTML = dom;
    }

    //
    const content = template_el.content.cloneNode(true) as DocumentFragment;
    this.shadowRoot.appendChild(content);

    // styles
    this._style_el.innerHTML += box_style;
    this.shadowRoot.appendChild(this._style_el);

    // features
    if (this.scanline) {
      this.initScanlines();
    }
  }

  public unbind() {
    this.input_status = "responding";
  }

  // or createOutput
  public createRespond() {}

  public createInput() {
    if (this.input_status === "responding") {
      return;
    }
    if (this.input_status === "input") {
      this.endInput();
    }
    const div_container = document.createElement("div");
    this.input_span = document.createElement("span");
    const span_content = document.createElement("span");
    const content_box = this.shadowRoot.querySelector(".content");
    div_container.appendChild(span_content);
    content_box.appendChild(div_container);
    const box = new TerminalLine({
      type: "input",
      el: span_content,
      speed: this.speed,
      content: this.start_word,
    });
    box.on("typing", () => {
      this.input_status = "responding";
    });
    box.on("complete", () => {
      this.input_status = "input";
      const cursor = this.getCursor();
      cursor?.insertAdjacentElement("beforebegin", this.input_span);
    });
    box.start();
    this._current_box = box;
    this._current_line = div_container;
  }

  public clear() {
    this.records.forEach((record) => {
      record.type_instance?.clear();
      record.el?.parentElement?.removeChild(record.el);
    });

    // TODO: confirm
    this.records = [];
  }

  private initScanlines() {
    // TODO: speed control
    this._style_el.innerHTML += scanline_style;
  }

  private insertChar(char: string) {
    if (this.input_status !== "input" || !this.input_span) {
      return;
    }
    this.input_span.innerHTML += char;
  }

  private endInput() {
    this.records.push({
      type: "input",
      id: this.msg_id++,
      type_instance: this._current_box,
      messge: this.input_span?.textContent ?? "",
      el: this._current_line,
    });
    this._current_line = null;
    this.input_span = null;
    this.removeCursor();
  }

  private removeCursor() {
    const cursor = this.getCursor();
    cursor?.parentNode?.removeChild(cursor);
  }

  private getCursor() {
    const cursor = this.shadowRoot.querySelector(".typed-cursor");
    return cursor;
  }

  private bindKeyBoard() {
    const KEYBOARD_CODE = {
      a: "a".charCodeAt(0),
      z: "z".charCodeAt(0),
    };
    for (let i = KEYBOARD_CODE.a; i <= KEYBOARD_CODE.z; i++) {
      const char = String.fromCharCode(i);
      keyboardJS.bind(char, () => {
        this.insertChar(char);
      });
    }
    keyboardJS.bind("enter", () => {
      if (this.input_status === "input") {
        this.dispatchEvent(new CustomEvents("input-finish", this.input_span.textContent));
        this.endInput();
      }
    });
  }
}

(function () {
  customElements.define(Terminal.COMPONENT_NAME, Terminal);
})();
