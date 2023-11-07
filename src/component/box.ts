import { WebComponent } from "@/type.d";
import { TerminalLine } from "./line";
import { TerminalBoxEvent, TerminalBoxEventsName, TermnialEventsHandler } from "./events";
import keyboardJS from "keyboardjs";
import dom from "@/assets/dom.html?raw";
import box_style from "@/assets/scss/terminal-box.scss?inline";
import scanline_style from "@/assets/scss/scanline.scss?inline";
import default_config from "@/configs";

export class Terminal extends WebComponent {
  static COMPONENT_NAME = "terminal-box";
  static TEMPLATE_ID = "terminal-box";

  public records: {
    seq: number;
    messge: string;
    type: "input" | "respond";
    el: HTMLElement;
    type_instance: TerminalLine;
  }[] = [];

  public scanline: string;
  public speed: string = default_config.speed;
  public start_word: string = default_config.start_word;

  public input_status: "input" | "responding" | "idle" = "idle";

  private input_span: HTMLSpanElement;
  private seq: number = 0;

  private _current_line_el: HTMLDivElement;
  private _current_line: TerminalLine;
  private _style_el = document.createElement("style");

  static get observedAttributes() {
    return ["start_word", "speed", "scanline"];
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

  attributeChangedCallback(name, _oldValue, newValue) {
    if (_oldValue === newValue) {
      return;
    }
    if (Terminal.observedAttributes.includes(name)) {
      this[name] = newValue;
    }
    if (name === "scanline") {
      this.useScanlines(newValue);
    }
  }

  getRecords() {
    return this.records;
  }

  public unbind() {
    this.input_status = "idle";
  }

  // or createOutput
  public createRespond(res: string | string[]) {
    if (this.input_status === "input") {
      this.endInput();
    }
    if (this.input_status === "responding") {
      return;
    }
    let content: string = "";
    if (Array.isArray(res)) {
      content = res.join("<br />");
    }
    if (typeof res === "string") {
      content = res;
    }
    this.input_status = "responding";
    const line = this.createNewLine({
      content,
      type: "respond",
    });
    line.on("complete", () => {
      this.input_status = "idle";
      this.records.push({
        type: "respond",
        seq: this.seq,
        messge: content,
        el: this._current_line_el,
        type_instance: this._current_line,
      });
      this.removeCursor();
    });
    line.start();
  }

  public createInput() {
    if (this.input_status === "responding") {
      return;
    }
    if (this.input_status === "input") {
      this.endInput();
    }
    this.input_span = document.createElement("span");
    const line = this.createNewLine({ type: "input" });
    line.on("complete", () => {
      this.input_status = "input";
      const cursor = this.getCursor();
      cursor?.insertAdjacentElement("beforebegin", this.input_span);
    });
    line.start();
  }

  public clear() {
    this.records.forEach((record) => {
      record.type_instance?.clear();
      record.el?.parentElement?.removeChild(record.el);
    });

    // TODO: confirm
    this.records = [];
  }

  /**
   * override
   * addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
   */
  override addEventListener<K extends keyof TermnialEventsHandler>(
    type: K,
    listener: K extends TerminalBoxEventsName ? TermnialEventsHandler[K] : EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }

  private createNewLine(params: { type: "input" | "respond"; content?: string }) {
    const { type, content } = params;
    const span_content = document.createElement("span");
    const content_box = this.shadowRoot.querySelector(".content");
    const div_container = document.createElement("div");
    div_container.appendChild(span_content);
    content_box.appendChild(div_container);
    // create line
    const line = new TerminalLine({
      el: span_content,
      speed: Number(this.speed),
      content: type === "input" ? this.start_word : content,
    });
    line.on("complete", () => {
      this.dispatchEvent(new TerminalBoxEvent("typing-finish"));
    });
    line.on("typing", () => {
      this.input_status = "responding";
      this.dispatchEvent(new TerminalBoxEvent("start-typing"));
    });

    this._current_line = line;
    this._current_line_el = div_container;

    return line;
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
    this._style_el.innerHTML += scanline_style;
    this.shadowRoot.appendChild(this._style_el);

    // features
    this.useScanlines(this.scanline);
  }

  private useScanlines(use: string) {
    const scanlines = this.shadowRoot?.querySelector(".scanlines") as HTMLElement;
    if (scanlines && !use) {
      scanlines.style.display = "none";
    }
    if (scanlines && use) {
      scanlines.style.display = "block";
    }
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
      seq: this.seq++,
      el: this._current_line_el,
      type_instance: this._current_line,
      messge: this.input_span?.textContent ?? "",
    });
    this._current_line_el = null;
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
        this.dispatchEvent(new TerminalBoxEvent("input-finish", this.input_span.textContent));
        this.endInput();
      }
    });
  }
}

(function () {
  customElements.define(Terminal.COMPONENT_NAME, Terminal);
})();
