import { useContext, useEffect, useState } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";
import { DesktopManagerContext } from "./desktop_manager.ts";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { Replica } from "../../willow-js/src/replica/replica.ts";
import { Payload, SignedEntry } from "../../willow-js/mod.universal.ts";
import { encode as encodeBase32 } from "https://deno.land/std@0.188.0/encoding/base32.ts";
import { pubKeyAuthors } from "./authors.ts";

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
      console.log({ entries });
      setEntries(entries);
    });
  }, []);

  console.log(entries);

  return (
    <div className={"widget"}>
      {entries
        ? (
          <table>
            {entries.map(([signed, payload]) => {
              return (
                <tr>
                  <td>
                    {decoder.decode(signed.entry.identifier.path)}
                  </td>
                  <td>
                    {pubKeyAuthors.get(
                      encodeBase32(signed.entry.identifier.author),
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        desktopManager.addItem({
                          id: encodeBase32(signed.namespaceSignature),
                          kind: "entry",
                          entry: signed,
                          payload: payload,
                        });
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        )
        : <div>⏳</div>}
      <div>
        <button
          onClick={() => {
            desktopManager.addItem({
              kind: "replica_entry_creator",
              id: `${Date.now()}`,
              computerId,
              namespaceAlias,
            });
          }}
        >
          Open entry creator
        </button>
      </div>
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

// path / author
