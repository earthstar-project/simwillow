import { useContext, useEffect, useState } from "preact/hooks";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";
import { NamespaceLabel } from "./namespace_label.tsx";

const EXAMPLE_NAMESPACES = [
  "My Family",
  "Spooky Book Lovers",
  "Invertebrate Appreciators",
  "Stoic Club",
];

export function NamespaceWidget() {
  const manager = useContext(NamespaceManagerContext);

  const [_bump, setBump] = useState(true);

  useEffect(() => {
    const onItemAdded = () => {
      setBump((prev) => !prev);
    };

    manager.addEventListener("namespaceAdded", onItemAdded);

    return () => {
      manager.removeEventListener("namespaceAdded", onItemAdded);
    };
  });

  const [newNamespaceName, setNewNamespaceName] = useState("");

  const namespaces = manager.getNamespaces();

  const [suggestion, setSuggestion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestion((prev) => {
        if (prev < EXAMPLE_NAMESPACES.length - 1) {
          return prev + 1;
        }

        return 0;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="widget namespace">
      {namespaces.length > 0
        ? (
          <ul className={"row-list"}>
            {namespaces.map(([name]) => {
              return (
                <li className="row">
                  <NamespaceLabel>{name}</NamespaceLabel>
                </li>
              );
            })}
          </ul>
        )
        : null}
      <form
        className="namespace"
        onSubmit={async (e) => {
          e.preventDefault();

          if (newNamespaceName.trim().length === 0) {
            return;
          }

          await manager.addNamespace(newNamespaceName);

          setNewNamespaceName("");
        }}
      >
        <input
          required
          type="text"
          value={newNamespaceName}
          placeholder={EXAMPLE_NAMESPACES[suggestion]}
          onChange={(e) => {
            setNewNamespaceName(e.target!.value);
          }}
        />
        <button type="submit">Create new namespace</button>
      </form>

      <footer className="info">
        <InfoButton labelled info={Info.Namespaces} />
      </footer>
    </div>
  );
}
