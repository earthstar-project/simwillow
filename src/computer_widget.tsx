import { useContext } from "preact/hooks";
import { ComputerItem, DesktopManagerContext } from "./desktop_manager.ts";

export function ComputerWidget({ computer }: { computer: ComputerItem }) {
  const desktopManager = useContext(DesktopManagerContext);

  return (
    <div
      onDblClick={() => {
        desktopManager.addItem({
          kind: "computer_details",
          id: `${computer.id}_details`,
          computerId: `${computer.id}`,
        });
      }}
      class="computer-widget"
    >
      {computer.icon}
    </div>
  );
}
