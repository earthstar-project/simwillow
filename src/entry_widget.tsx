import { Payload, SignedEntry } from "willow";
import { encode as encodeBase32 } from "std_base32";
import { pubKeyAuthors } from "./authors.ts";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { NamespaceManagerContext } from "./namespace_manager.tsx";
import { ByteViz } from "./byte_viz.tsx";

const decoder = new TextDecoder();

export function EntryWidget(
  { signed, payload }: { signed: SignedEntry; payload?: Payload },
) {
  const author = useMemo(() => {
    return pubKeyAuthors.get(encodeBase32(signed.entry.identifier.author));
  }, [signed]);

  const namespaceManager = useContext(NamespaceManagerContext);

  const namespaceb32 = useMemo(() => {
    return encodeBase32(signed.entry.identifier.namespace);
  }, [signed]);

  const authorb32 = useMemo(() => {
    return encodeBase32(signed.entry.identifier.author);
  }, [signed]);

  const [decodedPayload, setDecodedPayload] = useState<string | undefined>(
    undefined,
  );

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
          <td>Namespace</td>
          <td>{namespaceManager.getNamespaceAliasFromBase32(namespaceb32)}</td>
        </tr>
        <tr>
          <td>Path</td>
          <td>{decoder.decode(signed.entry.identifier.path)}</td>
        </tr>
        <tr>
          <td>Author</td>
          <td>{pubKeyAuthors.get(authorb32)}</td>
        </tr>

        <tr>
          <td>Payload hash</td>
          <td>
            <ByteViz bytes={signed.entry.record.hash} height={10} rows={1} />
          </td>
        </tr>

        <tr>
          <td>Payload length</td>
          <td>{signed.entry.record.length}</td>
        </tr>

        <tr>
          <td>Timestamp</td>
          <td>{signed.entry.record.timestamp}</td>
        </tr>

        <tr>
          <td>Payload</td>
          <td>{decodedPayload}</td>
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
