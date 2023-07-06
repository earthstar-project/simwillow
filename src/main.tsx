import { render } from "preact";
import { Desktop } from "./desktop.tsx";
import { DesktopManager, DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { NamespaceManager } from "./namespace_manager.tsx";
import { ComputerManager, ComputerManagerContext } from "./computer_manager.ts";
import { ByteViz } from "./byte_viz.tsx";

function SimWillow() {
  const namespaceManager = new NamespaceManager();
  const computerManager = new ComputerManager(namespaceManager);

  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const otherBytes = new TextEncoder().encode("gwil");

  return (
    <NamespaceManagerContext.Provider value={namespaceManager}>
      <ComputerManagerContext.Provider value={computerManager}>
        <DesktopManagerContext.Provider
          value={new DesktopManager({ computerManager })}
        >
          <Desktop />
        </DesktopManagerContext.Provider>
      </ComputerManagerContext.Provider>
    </NamespaceManagerContext.Provider>
  );
}

const el = document.getElementById("root");

if (el) {
  render(<SimWillow />, el);
}
