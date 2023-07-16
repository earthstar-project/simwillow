import { useContext, useEffect, useState } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";
import {
  ComputerDetailsItem,
  DesktopManagerContext,
} from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { WindowContext } from "./window.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";
import { NamespaceLabel } from "./namespace_label.tsx";

export function ComputerDetailsWidget(
  { computerDetails }: { computerDetails: ComputerDetailsItem },
) {
  const computerManager = useContext(ComputerManagerContext);
  const namespaceManager = useContext(NamespaceManagerContext);
  const desktopManager = useContext(DesktopManagerContext);

  const computer = computerManager.getComputerPeer(computerDetails.computerId);

  const [_, bump] = useState(true);

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

  const namespaceAliases = Array.from(computer.keys());

  return (
    <div className={"widget computer-details"}>
      <fieldset>
        <legend>Namespaces</legend>
        <ul className={"row-list"}>
          <li className={"row heading"}>Subscribed</li>
          {namespaceAliases.length === 0
            ? <li className="row">Not subscribing to any namespaces.</li>
            : null}
          {namespaceAliases.map((namespaceAlias) => {
            return (
              <li className="row">
                <NamespaceLabel>{namespaceAlias}</NamespaceLabel>
                <button
                  className="detail"
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
                  🔍
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="row-list">
          <li className="row heading">Available</li>
          {addNamespaceOptions.length > 0
            ? (
              <>
                {addNamespaceOptions.map(([name]) => {
                  return (
                    <li className="row">
                      <NamespaceLabel>{name}</NamespaceLabel>
                      <button
                        className="detail"
                        onClick={async () => {
                          await computerManager.addNamespaceToComputer(
                            computerDetails.computerId,
                            name,
                          );
                        }}
                      >
                        ➕
                      </button>
                    </li>
                  );
                })}
              </>
            )
            : namespaces.length === 0
            ? (
              <li className="row">
                <span>No namespaces have been created.</span>
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
                  Open Namespace Manager
                </button>
              </li>
            )
            : <li className={"row"}>All namespaces added.</li>}
        </ul>
      </fieldset>

      <footer className="info">
        <InfoButton labelled info={Info.Computers} />
      </footer>
    </div>
  );
}
