import { render } from "preact";
import { Desktop } from "./desktop.tsx";
import { DesktopManager, DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { NamespaceManager } from "./namespace_manager.tsx";
import { ComputerManager, ComputerManagerContext } from "./computer_manager.ts";
import {
  InfoReadTracker,
  InfoReadTrackerContext,
} from "./info_read_tracker.ts";

function SimWillow() {
  const namespaceManager = new NamespaceManager();
  const computerManager = new ComputerManager(namespaceManager);

  return (
    <NamespaceManagerContext.Provider value={namespaceManager}>
      <ComputerManagerContext.Provider value={computerManager}>
        <DesktopManagerContext.Provider
          value={new DesktopManager({ computerManager })}
        >
          <InfoReadTrackerContext.Provider value={new InfoReadTracker()}>
            <Desktop />
          </InfoReadTrackerContext.Provider>
        </DesktopManagerContext.Provider>
      </ComputerManagerContext.Provider>
    </NamespaceManagerContext.Provider>
  );
}

const el = document.getElementById("root");

if (el) {
  render(<SimWillow />, el);
}
