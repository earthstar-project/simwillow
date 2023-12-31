import { createContext } from "preact";
import { ComputerManager } from "./computer_manager.ts";
import { NamespaceManager } from "./namespace_manager.tsx";
import { Payload, SignedEntry } from "willow";
import { type InfoContents } from "./info_contents.tsx";
import * as Info from "./info_contents.tsx";

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
  computerId: string;
  entry: SignedEntry;
  payload?: Payload;
}

export interface InfoItem extends DesktopItemBase {
  kind: "info";
  info: InfoContents;
}

export type DesktopItem =
  | ComputerItem
  | ComputerDetailsItem
  | NamespaceManagerItem
  | ReplicaDetailsItem
  | ReplicaEntryCreatorItem
  | EntryItem
  | InfoItem;

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

    this.addInfoItem(Info.Intro, { x: 100, y: 100 });
  }

  addInfoItem(info: InfoContents, initialPosition: { x: number; y: number }) {
    this.addItem({
      kind: "info",
      id: info.id,
      info,
    }, initialPosition);
  }

  addItem(item: DesktopItem, initialPosition: { x: number; y: number }) {
    const zIndex = item.kind === "computer" || this.items.size === 0
      ? 0
      : this.getHighestZIndex() + 1;

    this.items.set(item.id, [item, {
      initialPosition: initialPosition,
      zIndex,
    }]);
    this.dispatchEvent(new CustomEvent("itemAdded"));
  }

  bringItemToFore(itemId: string) {
    const item = this.items.get(itemId);

    if (!item || item[0].kind === "computer") {
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
