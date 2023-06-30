import { useContext, useEffect, useState } from "preact/hooks";
import { NamespaceManagerContext } from "./namespace_manager.tsx";

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

  return (
    <div id="namespace-widget">
      <h1>Namespaces</h1>
      <p>Separate universes of data which peers can sync with each other.</p>
      {manager.getNamespaces().map(([name, keypair]) => {
        return <div>{name}</div>;
      })}
      <hr />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await manager.addNamespace(newNamespaceName);

          setNewNamespaceName("");
        }}
      >
        <input
          type="text"
          value={newNamespaceName}
          onChange={(e) => {
            setNewNamespaceName(e.target!.value);
          }}
        />
        <button type="submit">Create new namespace</button>
      </form>
    </div>
  );
}
