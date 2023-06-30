import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { ComponentChildren, createContext, toChildArray } from "preact";
import { useDrag } from "react-use-gesture";

import { Window } from "./window.tsx";
import { DesktopItem, DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceWidget } from "./namespace_widget.tsx";
import { ComputerWidget } from "./computer_widget.tsx";

export function Desktop() {
  const desktopManager = useContext(DesktopManagerContext);
  const [_bump, setBump] = useState(true);

  useEffect(() => {
    const onItemAdded = () => {
      setBump((prev) => !prev);
    };

    desktopManager.addEventListener("itemAdded", onItemAdded);

    return () => {
      desktopManager.removeEventListener("itemAdded", onItemAdded);
    };
  });

  return (
    <div id="desktop">
      <nav>
        <button
          onClick={() => {
            desktopManager.addItem({
              kind: "computer",
              id: `${Date.now()}`,
              icon: "💻",
            });
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
        <Window>
          <ItemComponent item={item} />
        </Window>
      ))}
    </div>
  );
}

function ItemComponent({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case "namespace_manager":
      return <NamespaceWidget key={item.id} />;
    case "computer":
      return <ComputerWidget key={item.id} computer={item} />;

    default:
      return <div>???</div>;
  }
}
