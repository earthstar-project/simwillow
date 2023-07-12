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

export type LayoutDetails = {
  initialPosition: { x: number; y: number };
  zIndex: number;
};

export class DesktopManager extends EventTarget {
  private items = new Map<string, [DesktopItem, LayoutDetails]>();

  constructor({ computerManager }: { computerManager: ComputerManager }) {
    super();

    computerManager.addEventListener("computerAdded", (event) => {
      const id = (event as CustomEvent).detail["id"];

      this.addItem({
        kind: "computer",
        id,
        icon: "💻",
      }, {
        x: 10,
        y: 10,
      });
    });

    computerManager.addEventListener("computerRemoved", (event) => {
      const id = (event as CustomEvent).detail["id"];

      this.removeItem(id);
    });
  }

  addItem(item: DesktopItem, initialPosition: { x: number; y: number }) {
    const zIndex = this.items.size === 0 ? 0 : this.getHighestZIndex() + 1;

    this.items.set(item.id, [item, {
      initialPosition: initialPosition,
      zIndex,
    }]);
    this.dispatchEvent(new CustomEvent("itemAdded"));
  }

  bringItemToFore(itemId: string) {
    const item = this.items.get(itemId);

    if (!item) {
      return;
    }

    const newZIndex = this.getHighestZIndex() + 1;

    this.items.set(itemId, [
      item[0],
      {
        ...item[1],
        zIndex: newZIndex,
      },
    ]);

    // trigger event.
    this.dispatchEvent(
      new CustomEvent("itemIndexChanged", {
        detail: {
          id: itemId,
          index: newZIndex,
        },
      }),
    );
  }

  removeItem(itemId: string) {
    this.items.delete(itemId);

    this.dispatchEvent(new CustomEvent("itemRemoved"));
  }

  getItems() {
    return Array.from(this.items.values());
  }

  private getHighestZIndex() {
    return Math.max(
      ...Array.from(this.items.values()).map(([_, layout]) => layout.zIndex),
    );
  }
}

export const DesktopManagerContext = createContext(
  new DesktopManager({
    computerManager: new ComputerManager(new NamespaceManager()),
  }),
);
