import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";
import { DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { Replica } from "../../willow-js/src/replica/replica.ts";
import { Payload, SignedEntry } from "../../willow-js/mod.universal.ts";
import { authors } from "./authors.ts";
import { encode as encodeBase32 } from "std_base32";
import { WindowContext } from "./window.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";

const encoder = new TextEncoder();

const NO_AUTHOR_SELECTED = "NO_AUTHOR_SELECTED";

export function ReplicaEntryCreatorWidget(
  { computerId, namespaceAlias, itemId }: {
    computerId: string;
    namespaceAlias: string;
    itemId: string;
  },
) {
  const computerManager = useContext(ComputerManagerContext);
  const desktopManager = useContext(DesktopManagerContext);
  const namespaceManager = useContext(NamespaceManagerContext);

  const [author, setAuthor] = useState<string>(NO_AUTHOR_SELECTED);
  const [path, setPath] = useState("");
  const [payload, setPayload] = useState("");

  const pathBytes = useMemo(() => {
    return encoder.encode(path);
  }, [path]);

  const peer = computerManager.getComputerPeer(computerId);

  if (!peer) {
    return <div>argh</div>;
  }

  const replica = peer.get(namespaceAlias);

  if (!replica) {
    return <div>ooof</div>;
  }

  const parentWindow = useContext(WindowContext);

  return (
    <div className={"widget entry-create"}>
      <form
        className="entry-create"
        onSubmit={async (e) => {
          e.preventDefault();

          if (author === NO_AUTHOR_SELECTED) {
            return;
          }

          const authorKeypair = authors.get(author);

          if (!authorKeypair) {
            console.error(
              `UI was expecting keypair of ${author} but couldn't get it`,
            );
            return;
          }

          const namespaceKeypair = namespaceManager.getNamespaceKeypair(
            namespaceAlias,
          );

          if (!namespaceKeypair) {
            console.error(
              `UI was expecting keypair of ${namespaceAlias} but couldn't get it`,
            );
            return;
          }

          const res = await replica.set(namespaceKeypair, authorKeypair, {
            path: pathBytes,
            payload: encoder.encode(payload),
          });

          if (res.kind === "success") {
            setPath("");
            setPayload("");
            setAuthor(NO_AUTHOR_SELECTED);
            desktopManager.addItem({
              kind: "entry",
              entry: res.signed,
              id: encodeBase32(res.signed.namespaceSignature),
              computerId,
              payload: {
                bytes: () => Promise.resolve(encoder.encode(payload)),
                stream: new ReadableStream(),
              },
            }, {
              x: parentWindow.position.x + 20,
              y: parentWindow.position.y + 20,
            });
          }
        }}
      >
        <table className={"entry-detail"}>
          <tr>
            <td>Author</td>
            <td>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                <option value={NO_AUTHOR_SELECTED} disabled>
                  Select an author
                </option>
                {Array.from(authors.keys()).map((author) => {
                  return <option value={author}>{author}</option>;
                })}
              </select>
            </td>
          </tr>

          <tr>
            <td>Path</td>
            <td>
              <input
                required
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Payload</td>
            <td>
              <input
                required
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td>
              <button type="submit">Add new entry</button>
            </td>
          </tr>
        </table>
      </form>
      <footer className="info">
        <div>
          <InfoButton labelled info={Info.Entries} />
        </div>
        <div>
          <InfoButton labelled info={Info.EntryCreationRequirements} />
        </div>
        <div>
          <InfoButton labelled info={Info.EntryCreationTips} />
        </div>
      </footer>
    </div>
  );
}
