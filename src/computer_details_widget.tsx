import { useContext, useEffect, useState } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";
import {
  ComputerDetailsItem,
  DesktopManagerContext,
} from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { WindowContext } from "./window.tsx";

const NO_OPTION_CHOSEN = "NEVERNOTEVERNEVERNOTEVERNEVERNOTEVERNEVERNOTEVER";

export function ComputerDetailsWidget(
  { computerDetails }: { computerDetails: ComputerDetailsItem },
) {
  const computerManager = useContext(ComputerManagerContext);
  const namespaceManager = useContext(NamespaceManagerContext);
  const desktopManager = useContext(DesktopManagerContext);

  const computer = computerManager.getComputerPeer(computerDetails.computerId);

  const [_, bump] = useState(true);

  const [selectedNamespace, setSelectedNamespace] = useState<
    string
  >(NO_OPTION_CHOSEN);

  useEffect(() => {
    const callback = () => {
      bump((prev) => !prev);
    };

    const namespaceAddedCb = (event: Event) => {
      const computerId = (event as CustomEvent).detail["computerId"];

      if (computerId === computerDetails.computerId) {
        callback();
      }
    };

    namespaceManager.addEventListener("namespaceAdded", callback);
    computerManager.addEventListener(
      "computerNamespaceAdded",
      namespaceAddedCb,
    );

    return () => {
      namespaceManager.removeEventListener("namespaceAdded", callback);
      computerManager.removeEventListener(
        "computerNamespaceAdded",
        namespaceAddedCb,
      );
    };
  }, []);

  const namespaces = namespaceManager.getNamespaces();

  if (!computer) {
    return <div>No computer found!!! Argh!!!</div>;
  }

  const addNamespaceOptions = namespaces.filter(([alias]) => {
    return !computer.has(alias);
  });

  const parentWindow = useContext(WindowContext);

  return (
    <div className={"widget"}>
      <h2>Namespaces interested in</h2>
      <ul>
        {Array.from(computer.keys()).map((namespaceAlias) => {
          return (
            <li>
              <button
                onClick={() => {
                  desktopManager.addItem({
                    kind: "replica_details",
                    id: `${computerDetails.computerId}_${namespaceAlias}`,
                    computerId: computerDetails.computerId,
                    namespaceAlias: namespaceAlias,
                  }, {
                    x: parentWindow.position.x + 20,
                    y: parentWindow.position.y + 20,
                  });
                }}
              >
                {namespaceAlias}
              </button>
            </li>
          );
        })}
      </ul>

      {addNamespaceOptions.length > 0
        ? (
          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (selectedNamespace === NO_OPTION_CHOSEN) {
                return;
              }

              await computerManager.addNamespaceToComputer(
                computerDetails.computerId,
                selectedNamespace,
              );

              setSelectedNamespace(NO_OPTION_CHOSEN);
            }}
          >
            <select
              value={selectedNamespace}
              onChange={(e) => {
                setSelectedNamespace(e.target.value);
              }}
            >
              <option disabled value={NO_OPTION_CHOSEN}>
                Select a namespace
              </option>
              {addNamespaceOptions.map(([name]) => {
                return <option key={name} value={name}>{name}</option>;
              })}
            </select>
            <button type="submit">Add to this computer</button>
          </form>
        )
        : (
          <div>
            No namespaces to add.

            <button
              onClick={() => {
                desktopManager.addItem({
                  kind: "namespace_manager",
                  id: `singleton`,
                }, {
                  x: parentWindow.position.x + 20,
                  y: parentWindow.position.y + 20,
                });
              }}
            >
              Open namespace manager
            </button>
          </div>
        )}
    </div>
  );
}
