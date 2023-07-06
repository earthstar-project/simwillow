import { createContext } from "preact";
import { ComputerManager } from "./computer_manager.ts";
import { NamespaceManager } from "./namespace_manager.tsx";
import { Payload, SignedEntry } from "willow";

export interface DesktopItemBase {
  kind: string;
  id: string;
}

export interface ComputerItem extends DesktopItemBase {
  kind: "computer";
  icon: "💻" | "🖥" | "📱";
}

export interface ComputerDetailsItem extends DesktopItemBase {
  kind: "computer_details";
  computerId: string;
}

export interface NamespaceManagerItem extends DesktopItemBase {
  kind: "namespace_manager";
  id: "singleton";
}

export interface ReplicaDetailsItem extends DesktopItemBase {
  kind: "replica_details";
  computerId: string;
  namespaceAlias: string;
}

export interface ReplicaEntryCreatorItem extends DesktopItemBase {
  kind: "replica_entry_creator";
  computerId: string;
  namespaceAlias: string;
}

export interface EntryItem extends DesktopItemBase {
  kind: "entry";
  entry: SignedEntry;
  payload?: Payload;
}

export type DesktopItem =
  | ComputerItem
  | ComputerDetailsItem
  | NamespaceManagerItem
  | ReplicaDetailsItem
  | ReplicaEntryCreatorItem
  | EntryItem;

export class DesktopManager extends EventTarget {
  constructor({ computerManager }: { computerManager: ComputerManager }) {
    super();

    computerManager.addEventListener("computerAdded", (event) => {
      const id = (event as CustomEvent).detail["id"];

      this.addItem({
        kind: "computer",
        id,
        icon: "💻",
      });
    });

    computerManager.addEventListener("computerRemoved", (event) => {
      const id = (event as CustomEvent).detail["id"];

      this.removeItem(id);
    });
  }

  addItem(item: DesktopItem) {
    this.items.set(item.id, item);
    this.dispatchEvent(new CustomEvent("itemAdded"));
  }

  removeItem(itemId: string) {
    this.items.delete(itemId);

    console.log("removed", itemId);

    this.dispatchEvent(new CustomEvent("itemRemoved"));
  }

  private items = new Map<string, DesktopItem>();

  getItems() {
    return Array.from(this.items.values());
  }
}

export const DesktopManagerContext = createContext(
  new DesktopManager({
    computerManager: new ComputerManager(new NamespaceManager()),
  }),
);
