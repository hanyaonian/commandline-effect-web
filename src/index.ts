import { WebComponent } from "./type.d";
import dom from "./assets/dom.html?raw";
import box_style from "./assets/css/terminal-box.css?raw";
import scanline_style from "./assets/scss/scanline.scss?inline";
import default_config, { type TerminalConfigs } from "./configs";

export class TerminalBox extends WebComponent {
  static COMPONENT_NAME = "terminal-box";
  static TEMPLATE_ID = "terminal-box";

  private _style_el = document.createElement("style");
  private _shadow_container = this.attachShadow({ mode: "open" });

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
    // init template
    let template_el = document.getElementById(TerminalBox.TEMPLATE_ID) as HTMLTemplateElement | null;
    if (!template_el) {
      template_el = document.createElement("template");
      template_el.setAttribute("id", TerminalBox.TEMPLATE_ID);
      template_el.innerHTML = dom;
    }

    //
    const content = template_el.content.cloneNode(true);
    this._shadow_container.appendChild(content);

    // styles
    this._style_el.innerHTML += box_style;
    this._shadow_container.appendChild(this._style_el);

    // features
    if (this.configs.scanline) {
      this.initScanlines();
    }
  }

  private initScanlines() {
    // TODO: speed control
    this._style_el.innerHTML += scanline_style;
  }
}

(function () {
  customElements.define(TerminalBox.COMPONENT_NAME, TerminalBox);
})();
