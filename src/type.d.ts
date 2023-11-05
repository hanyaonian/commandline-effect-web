/// <reference types="vite/client" />

export abstract class WebComponent extends HTMLElement {
  static readonly observedAttributes?: Array<string>;
  abstract connectedCallback(): void;
  abstract disconnectedCallback(): void;
  abstract attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void;
  abstract adoptedCallback?(): void;
}
