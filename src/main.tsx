import { render } from "preact";
import { Desktop } from "./desktop.tsx";
import { DesktopManager, DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { NamespaceManager } from "./namespace_manager.tsx";

function SimWillow() {
  return (
    <NamespaceManagerContext.Provider value={new NamespaceManager()}>
      <DesktopManagerContext.Provider value={new DesktopManager()}>
        <Desktop />
      </DesktopManagerContext.Provider>
    </NamespaceManagerContext.Provider>
  );
}

const el = document.getElementById("root");

if (el) {
  render(<SimWillow />, el);
}
