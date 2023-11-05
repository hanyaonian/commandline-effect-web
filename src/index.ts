import { WebComponent } from "./type.d";
import dom from "./assets/dom.html?raw";
import box_style from "./assets/css/terminal-box.css?raw";
import scanline from "./assets/css/scanline.css?raw";
import default_config, { type TerminalConfigs } from "./configs";

export class TerminalBox extends WebComponent {
  static COMPONENT_NAME = "terminal-box";
  static TEMPLATE_ID = "terminal-box";

  static get observedAttributes() {
    return [];
  }

  constructor(private readonly configs: TerminalConfigs = default_config) {
    super();
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
    console.log("attributeChangedCallback: ", name, oldValue, newValue);
  }

  private initDom() {
    const shadow = this.attachShadow({ mode: "open" });

    // init template
    let template_el = document.getElementById(TerminalBox.TEMPLATE_ID) as HTMLTemplateElement | null;
    if (!template_el) {
      template_el = document.createElement("template");
      template_el.setAttribute("id", TerminalBox.TEMPLATE_ID);
      template_el.innerHTML = dom;
    }

    // styles
    const style_el = document.createElement("style");
    style_el.innerHTML += box_style;
    if (this.configs.scanline) {
      style_el.innerHTML += scanline;
    }

    const content = template_el.content.cloneNode(true);
    shadow.appendChild(content);
    shadow.appendChild(style_el);
  }
}

(function () {
  customElements.define(TerminalBox.COMPONENT_NAME, TerminalBox);
})();
