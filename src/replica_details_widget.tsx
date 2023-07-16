import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";
import { DesktopManagerContext } from "./desktop_manager.ts";

import { Replica } from "../../willow-js/src/replica/replica.ts";
import { Payload, SignedEntry } from "../../willow-js/mod.universal.ts";

import { pubKeyAuthors } from "./authors.ts";
import { compareBytes } from "../../willow-js/src/util/bytes.ts";
import { WindowContext } from "./window.tsx";
import { Timestamp } from "./timestamp.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";
import { encodeBase32 } from "../../willow-js/deps.ts";

const decoder = new TextDecoder();

export function ReplicaDetailsWidget(
  { computerId, namespaceAlias }: {
    computerId: string;
    namespaceAlias: string;
  },
) {
  const computerManager = useContext(ComputerManagerContext);
  const desktopManager = useContext(DesktopManagerContext);

  const [entries, setEntries] = useState<
    Array<[SignedEntry, Payload | undefined]> | undefined
  >(undefined);

  const peer = computerManager.getComputerPeer(computerId);

  if (!peer) {
    return <div>argh</div>;
  }

  const replica = peer.get(namespaceAlias);

  if (!replica) {
    return <div>ooof</div>;
  }

  useEffect(() => {
    getAllEntries(replica).then((entries) => {
      setEntries(entries);
    });
  }, []);

  const [_, setBump] = useState(0);

  useEffect(() => {
    const callback = () => {
      setBump((prev) => prev + 1);
      getAllEntries(replica).then((entries) => {
        setEntries(entries);
      });
    };

    replica.addEventListener("entrypayloadset", callback);
    replica.addEventListener("entryingest", callback);
    replica.addEventListener("payloadingest", callback);

    return () => {
      replica.removeEventListener("entrypayloadset", callback);
      replica.removeEventListener("entryingest", callback);
      replica.removeEventListener("payloadingest", callback);
    };
  }, []);

  const [shouldInsertFlash, setShouldInsertFlash] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShouldInsertFlash(true);
    }, 0);
  }, []);

  const [deletingEntries, setDeletingEntries] = useState(
    new Map<string, SignedEntry>(),
  );

  useEffect(() => {
    const callback = (event: Event) => {
      const signedFromEvent = (event as CustomEvent)
        .detail["removed"] as SignedEntry;

      // Add to deleted items.
      const key = `${encodeBase32(signedFromEvent.entry.identifier.path)}_${
        encodeBase32(signedFromEvent.entry.identifier.author)
      }`;

      setDeletingEntries((prev) => {
        prev.set(key, signedFromEvent);

        return new Map(prev);
      });

      // Remove from deleted items after 2s
      setTimeout(() => {
        setDeletingEntries((prev) => {
          prev.delete(key);

          return new Map(prev);
        });
      }, 2000);
    };

    replica.addEventListener("entryremove", callback);

    return () => {
      replica.removeEventListener("entryremove", callback);
    };
  }, []);

  const mergedEntries: Array<[SignedEntry, Payload | undefined]> = useMemo(
    () => {
      if (deletingEntries.size === 0) {
        return entries || [];
      }

      return [
        ...(entries || []),
        ...Array.from(deletingEntries.values()).map((entry) =>
          [entry, undefined] as [SignedEntry, Payload | undefined]
        ),
      ];
    },
    [deletingEntries, entries],
  );

  const parentWindow = useContext(WindowContext);

  return (
    <div className={"widget replica"}>
      {entries && entries.length > 0
        ? (
          <table className={"replica-entries"}>
            <thead>
              <tr>
                <th>Path</th>
                <th>Author</th>
                <th>Timestamp</th>
                <th></th>
              </tr>
            </thead>
            {mergedEntries.map(([signed, payload]) => {
              const key = `${encodeBase32(signed.entry.identifier.path)}_${
                encodeBase32(signed.entry.identifier.author)
              }`;

              return (
                <Row
                  key={key}
                  signed={signed}
                  payload={payload}
                  insertionFlash={shouldInsertFlash}
                  deletionFlash={deletingEntries.has(key)}
                  replica={replica}
                  computerId={computerId}
                />
              );
            })}
          </table>
        )
        : null}
      {entries && entries.length === 0
        ? (
          <ul className={"row-list"}>
            <li className="row">This replica has no entries.</li>
          </ul>
        )
        : null}
      <div>
        <button
          onClick={() => {
            desktopManager.addItem({
              kind: "replica_entry_creator",
              id: `${Date.now()}`,
              computerId,
              namespaceAlias,
            }, {
              x: parentWindow.position.x + 20,
              y: parentWindow.position.y + 20,
            });
          }}
        >
          Open entry creator
        </button>
      </div>

      <footer className="info">
        <InfoButton labelled info={Info.Replicas} />
      </footer>
    </div>
  );
}

async function getAllEntries(replica: Replica<CryptoKeyPair>) {
  const entries = [];

  for await (const entry of replica.query({ order: "path" })) {
    entries.push(entry);
  }

  return entries;
}

function Row(
  { signed, payload, insertionFlash, deletionFlash, replica, computerId }: {
    signed: SignedEntry;
    payload?: Payload;
    insertionFlash?: boolean;
    deletionFlash?: boolean;
    replica: Replica<CryptoKeyPair>;
    computerId: string;
  },
) {
  const desktopManager = useContext(DesktopManagerContext);

  const [hasFlashedInsertion, setHasFlashedInsertion] = useState(
    insertionFlash === false,
  );
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasFlashedInsertion(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const callback = (event: Event) => {
      const signedFromEvent = (event as CustomEvent)
        .detail["signed"] as SignedEntry;

      const authorIsSame = compareBytes(
        signed.entry.identifier.author,
        signedFromEvent.entry.identifier.author,
      ) === 0;

      if (!authorIsSame) {
        return;
      }

      const pathIsSame = compareBytes(
        signed.entry.identifier.path,
        signedFromEvent.entry.identifier.path,
      ) === 0;

      if (!pathIsSame) {
        return;
      }

      setJustChanged(true);

      setTimeout(() => {
        setJustChanged(false);
      }, 2000);
    };

    replica.addEventListener("entrypayloadset", callback);
    replica.addEventListener("entryingest", callback);
    replica.addEventListener("payloadingest", callback);

    return () => {
      replica.removeEventListener("entrypayloadset", callback);
      replica.removeEventListener("entryingest", callback);
      replica.removeEventListener("payloadingest", callback);
    };
  }, []);

  const parentWindow = useContext(WindowContext);

  const flashClass = justChanged
    ? "changed"
    : deletionFlash
    ? "deleted"
    : (insertionFlash && hasFlashedInsertion === false)
    ? "inserted"
    : "";

  return (
    <tr
      className={`payload-row  ${flashClass}`}
    >
      <td>
        {decoder.decode(signed.entry.identifier.path)}
      </td>
      <td>
        {pubKeyAuthors.get(
          encodeBase32(signed.entry.identifier.author),
        )}
      </td>
      <td>
        <Timestamp timestamp={signed.entry.record.timestamp} />
      </td>
      <td>
        <button
          className={"detail"}
          onClick={() => {
            desktopManager.addItem({
              id: encodeBase32(signed.namespaceSignature),
              kind: "entry",
              entry: signed,
              payload: payload,
              computerId,
            }, {
              x: parentWindow.position.x + 20,
              y: parentWindow.position.y + 20,
            });
          }}
        >
          🔍
        </button>
      </td>
    </tr>
  );
}
