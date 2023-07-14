import { Payload, SignedEntry } from "willow";
import { encode as encodeBase32 } from "std_base32";
import { pubKeyAuthors } from "./authors.ts";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { ByteViz } from "./byte_viz.tsx";
import { Timestamp } from "./timestamp.tsx";
import * as Info from "./info_contents.tsx";
import { InfoButton } from "./info_button.tsx";

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
    <div className={"widget"}>
      <table>
        <tr>
          <td>Payload</td>
          <td>{decodedPayload}</td>
        </tr>
        <tr>
          <td colSpan={3}>
            Identifier <InfoButton info={Info.EntryIdentifier} />
          </td>
        </tr>

        <tr>
          <td>Namespace</td>
          <td>{namespaceAlias}</td>
        </tr>

        <tr>
          <td>Path</td>
          <td>{path}</td>
        </tr>

        <tr>
          <td>Author</td>
          <td>{author}</td>
        </tr>

        <tr>
          <td colSpan={3}>Record</td>
        </tr>

        <tr>
          <td>
            Payload hash <InfoButton info={Info.EntryHash} />
          </td>
          <td>
            <ByteViz bytes={signed.entry.record.hash} height={10} rows={1} />
          </td>
        </tr>

        <tr>
          <td>Payload length</td>
          <td>{signed.entry.record.length}</td>
        </tr>

        <tr>
          <td>
            Timestamp <InfoButton info={Info.EntryTimestamp} />
          </td>
          <td>
            <Timestamp timestamp={signed.entry.record.timestamp} />
          </td>
        </tr>

        <tr>
          <td colSpan={3}>Signatures</td>
        </tr>

        <tr>
          <td>Namespace signature</td>
          <td>
            <ByteViz bytes={signed.namespaceSignature} height={20} rows={2} />
          </td>
        </tr>

        <tr>
          <td>Author signature</td>
          <td>
            <ByteViz bytes={signed.authorSignature} height={20} rows={2} />
          </td>
        </tr>
      </table>
    </div>
  );
}
