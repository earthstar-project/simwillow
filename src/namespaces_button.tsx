import { useContext } from "preact/hooks";
import { DesktopManagerContext } from "./desktop_manager.ts";

export function NamespacesButton() {
  const desktopManager = useContext(DesktopManagerContext);

  return (
    <button
      onClick={() => {
        desktopManager.addItem({
          kind: "namespace_manager",
          id: `singleton`,
        }, {
          x: 10,
          y: 10,
        });
      }}
    >
      Namespaces
    </button>
  );
}
