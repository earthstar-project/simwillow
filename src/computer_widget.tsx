import { ComputerItem } from "./desktop_manager.ts";

export function ComputerWidget({ computer }: { computer: ComputerItem }) {
  return <div class="computer-widget">{computer.icon}</div>;
}
