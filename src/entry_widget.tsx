import { Payload, SignedEntry } from "willow";
import { encode as encodeBase32 } from "std_base32";
import { pubKeyAuthors } from "./authors.ts";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { ByteViz } from "./byte_viz.tsx";
import { Timestamp } from "./timestamp.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";
import { NamespaceLabel } from "./namespace_label.tsx";

const decoder = new TextDecoder();

export function EntryWidget(
  { signed, payload }: { signed: SignedEntry; payload?: Payload },
) {
  const author = useMemo(() => {
    return pubKeyAuthors.get(encodeBase32(signed.entry.identifier.author));
  }, [signed]);

  const namespaceManager = useContext(NamespaceManagerContext);

  const namespaceAlias = useMemo(() => {
    const b32 = encodeBase32(signed.entry.identifier.namespace);
    return namespaceManager.getNamespaceAliasFromBase32(b32);
  }, [signed]);

  const [decodedPayload, setDecodedPayload] = useState<string | undefined>(
    undefined,
  );

  const path = useMemo(() => {
    return decoder.decode(signed.entry.identifier.path);
  }, [signed]);

  useEffect(() => {
    if (payload) {
      payload.bytes().then((bytes) => {
        setDecodedPayload(decoder.decode(bytes));
      });
    }
  }, []);

  return (
    <div className={"widget entry"}>
      <table className="entry-detail">
        <tr>
          <td>Payload</td>
          <td>
            <div className={"payload"}>{decodedPayload}</div>
          </td>
        </tr>

        <tr className={"heading-row"}>
          <td>
            <h2>
              Identifier{"\u00A0"}
              <InfoButton info={Info.EntryIdentifier} />
            </h2>
          </td>
          <td></td>
        </tr>

        <tr>
          <td>Namespace</td>
          <td>
            <NamespaceLabel>{namespaceAlias}</NamespaceLabel>
          </td>
        </tr>

        <tr>
          <td>Path</td>
          <td>{path}</td>
        </tr>

        <tr>
          <td>Author</td>
          <td>{author}</td>
        </tr>

        <tr className={"heading-row"}>
          <td>
            <h2>Record</h2>
          </td>
          <td></td>
        </tr>

        <tr>
          <td>
            Hash{"\u00A0"}
            <InfoButton info={Info.EntryHash} />
          </td>
          <td>
            <ByteViz
              bytes={signed.entry.record.hash}
              height={20}
              rows={2}
            />
          </td>
        </tr>

        <tr>
          <td>Length</td>
          <td>{signed.entry.record.length}</td>
        </tr>

        <tr>
          <td>
            Timestamp{"\u00A0"}
            <InfoButton info={Info.EntryTimestamp} />
          </td>
          <td>
            <Timestamp timestamp={signed.entry.record.timestamp} />
          </td>
        </tr>

        <tr className={"heading-row"}>
          <td>
            <h2>Signatures</h2>
          </td>
          <td></td>
        </tr>

        <tr>
          <td>Namespace Signature</td>
          <td>
            <ByteViz bytes={signed.namespaceSignature} height={40} rows={4} />
          </td>
        </tr>

        <tr>
          <td>Author Signature</td>
          <td>
            <ByteViz bytes={signed.authorSignature} height={40} rows={4} />
          </td>
        </tr>
      </table>
    </div>
  );
}
