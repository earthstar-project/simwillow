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
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { encodeBase32 } from "../../willow-js/deps.ts";
import { pubKeyAuthors } from "./authors.ts";

export function Desktop() {
  const desktopManager = useContext(DesktopManagerContext);
  const computerManager = useContext(ComputerManagerContext);
  // Use an incrementing number here because events fired concurrently would cause a boolean to sometimes end up in the same place.
  const [_bump, setBump] = useState(0);

  useEffect(() => {
    const onItemChanged = () => {
      setBump((prev) => prev + 1);
    };

    desktopManager.addEventListener("itemAdded", onItemChanged);
    desktopManager.addEventListener("itemRemoved", onItemChanged);
    desktopManager.addEventListener("itemIndexChanged", onItemChanged);

    return () => {
      desktopManager.removeEventListener("itemAdded", onItemChanged);
      desktopManager.removeEventListener("itemRemoved", onItemChanged);
      desktopManager.removeEventListener("itemIndexChanged", onItemChanged);
    };
  });

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
            }, {
              x: 10,
              y: 10,
            });
          }}
        >
          Namespaces
        </button>
      </nav>
      {desktopManager.getItems().map(([item, layout]) => (
        <Window
          key={item.id}
          toolbar={shouldEnableToolbar(item)}
          itemId={item.id}
          title={<ItemToolbarTitle item={item} />}
          initialPos={layout.initialPosition}
          zIndex={layout.zIndex}
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

function ItemToolbarTitle(
  { item }: { item: DesktopItem },
) {
  const namespaceManager = useContext(NamespaceManagerContext);

  switch (item.kind) {
    case "computer_details":
      return <>Computer</>;
    case "namespace_manager":
      return <>Namespaces</>;
    case "replica_details":
      return <>Computer - Replica for {item.namespaceAlias}</>;
    case "replica_entry_creator":
      return <>Computer - Add entry to {item.namespaceAlias}</>;
    case "entry": {
      const namespaceb32 = encodeBase32(item.entry.entry.identifier.namespace);
      const namespaceAlias = namespaceManager.getNamespaceAliasFromBase32(
        namespaceb32,
      );
      const author = pubKeyAuthors.get(
        encodeBase32(item.entry.entry.identifier.author),
      );

      const path = new TextDecoder().decode(item.entry.entry.identifier.path);

      return <>Entry - {namespaceAlias} - {path} / {author}</>;
    }
    default:
      return null;
  }
}

function shouldEnableToolbar(item: DesktopItem): boolean {
  if (item.kind === "computer") {
    return false;
  }

  return true;
}
