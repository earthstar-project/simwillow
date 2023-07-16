import { useContext } from "preact/hooks";
import { ComputerItem, DesktopManagerContext } from "./desktop_manager.ts";
import { WindowContext } from "./window.tsx";

export function ComputerWidget({ computer }: { computer: ComputerItem }) {
  const desktopManager = useContext(DesktopManagerContext);

  const parentWindow = useContext(WindowContext);

  return (
    <div
      onDblClick={() => {
        desktopManager.addItem({
          kind: "computer_details",
          id: `${computer.id}_details`,
          computerId: `${computer.id}`,
        }, {
          x: parentWindow.position.x + 20,
          y: parentWindow.position.y + 20,
        });
      }}
      class="computer-widget"
    >
      <div>{computer.icon}</div>
      <div className="name">{computer.id}</div>
    </div>
  );
}
