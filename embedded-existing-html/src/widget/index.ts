import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import { Assistant } from "../app/assistant";
import cssText from "../app/globals.css?inline";

const Base = reactToWebComponent(Assistant, React, ReactDOM, {
  shadow: "open",
});

let sheet: CSSStyleSheet | null = null;
try {
  sheet = new CSSStyleSheet();
} catch { sheet = null; }

class MyWidgetEl extends (Base as { new(): HTMLElement }) {
  async connectedCallback() {
    // @ts-ignore
    super.connectedCallback?.();

    const root = this.shadowRoot;
    if (!root) return;

    const allCss = cssText;

    if ("adoptedStyleSheets" in root && sheet) {
      await sheet.replace(allCss);
      const others = (root.adoptedStyleSheets || []).filter(s => s !== sheet);
      root.adoptedStyleSheets = [...others, sheet];
    } else {
      // Fallback: <style>
      let style = root.querySelector<HTMLStyleElement>("style[data-widget]");
      if (!style) {
        style = document.createElement("style");
        style.setAttribute("data-widget", "");
        root.prepend(style);
      }
      style.textContent = allCss;
    }

  }
}

if (!customElements.get("my-widget")) {
  customElements.define("my-widget", MyWidgetEl);
}

export function mountMyWidget(target: string | HTMLElement = "#widget", props?: Record<string, any>) {
  const host = typeof target === "string" ? document.querySelector(target) as HTMLElement : target;
  if (!host) throw new Error("Mount target not found");
  const el = document.createElement("my-widget") as any;
  if (props) Object.assign(el, props);
  host.replaceChildren(el);
  return el;
}
