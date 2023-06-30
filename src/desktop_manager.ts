import { createContext } from "preact";

export interface DesktopItemBase {
  kind: string;
  id: string;
}

export interface ComputerItem extends DesktopItemBase {
  kind: "computer";
  id: string;
  icon: "💻" | "🖥" | "📱";
}

export interface NamespaceManager extends DesktopItemBase {
  kind: "namespace_manager";
  id: "singleton";
}

export type DesktopItem = ComputerItem | NamespaceManager;

export class DesktopManager extends EventTarget {
  addItem(item: DesktopItem) {
    this.items.set(item.id, item);
    this.dispatchEvent(new CustomEvent("itemAdded"));
  }

  removeItem(item: DesktopItem) {
    this.items.delete(item.id);
    this.dispatchEvent(new CustomEvent("itemRemoved"));
  }

  private items = new Map<string, DesktopItem>();

  getItems() {
    return Array.from(this.items.values());
  }
}

export const DesktopManagerContext = createContext(new DesktopManager());
