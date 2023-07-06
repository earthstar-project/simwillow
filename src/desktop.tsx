import { useContext, useEffect, useState } from "preact/hooks";

import { Window } from "./window.tsx";
import { DesktopItem, DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceWidget } from "./namespace_widget.tsx";
import { ComputerWidget } from "./computer_widget.tsx";
import { ComputerDetailsWidget } from "./computer_details_widget.tsx";
import { ComputerManagerContext } from "./computer_manager.ts";
import { ReplicaDetailsWidget } from "./replica_details_widget.tsx";
import { ReplicaEntryCreatorWidget } from "./replica_entry_creator_widget.tsx";
import { EntryWidget } from "./entry_widget.tsx";

export function Desktop() {
  const desktopManager = useContext(DesktopManagerContext);
  const computerManager = useContext(ComputerManagerContext);
  // Use an incrementing number here because events fired concurrently would cause a boolean to sometimes end up in the same place.
  const [_bump, setBump] = useState(0);

  useEffect(() => {
    const onItemChanged = () => {
      console.log("bumped");

      setBump((prev) => prev + 1);
    };

    desktopManager.addEventListener("itemAdded", onItemChanged);
    desktopManager.addEventListener("itemRemoved", onItemChanged);

    return () => {
      desktopManager.removeEventListener("itemAdded", onItemChanged);
      desktopManager.removeEventListener("itemRemoved", onItemChanged);
    };
  });

  console.log(desktopManager.getItems());

  return (
    <div id="desktop">
      <nav>
        <button
          onClick={() => {
            computerManager.addComputer(`${Date.now()}`);
          }}
        >
          Add computer
        </button>
        <button
          onClick={() => {
            desktopManager.addItem({
              kind: "namespace_manager",
              id: `singleton`,
            });
          }}
        >
          Namespaces
        </button>
      </nav>
      {desktopManager.getItems().map((item) => (
        <Window
          key={item.id}
          toolbar={shouldEnableToolbar(item)}
          itemId={item.id}
          title={itemToolbarTitle(item)}
        >
          <ItemComponent item={item} />
        </Window>
      ))}
    </div>
  );
}

function ItemComponent({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case "namespace_manager":
      return <NamespaceWidget />;
    case "computer":
      return <ComputerWidget computer={item} />;
    case "computer_details":
      return <ComputerDetailsWidget computerDetails={item} />;
    case "replica_details":
      return (
        <ReplicaDetailsWidget
          computerId={item.computerId}
          namespaceAlias={item.namespaceAlias}
        />
      );
    case "replica_entry_creator":
      return (
        <ReplicaEntryCreatorWidget
          computerId={item.computerId}
          namespaceAlias={item.namespaceAlias}
          itemId={item.id}
        />
      );
    case "entry":
      return <EntryWidget signed={item.entry} payload={item.payload} />;

    default:
      return <div>🪰</div>;
  }
}

function itemToolbarTitle(item: DesktopItem): string | undefined {
  switch (item.kind) {
    case "computer_details":
      return `Computer`;
    case "namespace_manager":
      return "Namespaces";
    case "replica_details":
      return `Computer - Replica for ${item.namespaceAlias}`;
    case "replica_entry_creator":
      return `Computer - Add entry to ${item.namespaceAlias}`;
    case "entry":
      return `Entry`;
    default:
      return undefined;
  }
}

function shouldEnableToolbar(item: DesktopItem): boolean {
  if (item.kind === "computer") {
    return false;
  }

  return true;
}
