import { Replica } from "willow";
import { createContext } from "preact";
import { exportKey, protocolParameters } from "./protocol.ts";
import { NamespaceManager } from "./namespace_manager.tsx";

type PeerPlaceholder = Map<string, Replica<CryptoKeyPair>>;

export class ComputerManager extends EventTarget {
  private computers = new Map<string, PeerPlaceholder>();
  private namespaceManager: NamespaceManager;

  constructor(namespaceManager: NamespaceManager) {
    super();

    this.namespaceManager = namespaceManager;
  }

  addComputer(id: string) {
    this.computers.set(id, new Map());

    this.dispatchEvent(new CustomEvent("computerAdded", { detail: { id } }));
  }

  removeComputer(id: string) {
    this.computers.delete(id);

    this.dispatchEvent(new CustomEvent("computerRemoved", { detail: { id } }));
  }

  getComputerPeer(id: string): PeerPlaceholder | undefined {
    return this.computers.get(id);
  }

  async addNamespaceToComputer(computerId: string, namespaceAlias: string) {
    const peer = this.computers.get(computerId);

    if (!peer) {
      console.warn("no peer for", computerId);
      return;
    }

    const keypair = this.namespaceManager.getNamespaceKeypair(namespaceAlias);

    if (!keypair) {
      console.warn("no keypair for", namespaceAlias);
      return;
    }

    if (peer.has(namespaceAlias)) {
      return;
    }

    const namespaceId = await exportKey(keypair.publicKey);

    const replica = new Replica(
      {
        namespace: new Uint8Array(namespaceId),
        protocolParameters,
      },
    );

    peer.set(namespaceAlias, replica);

    this.dispatchEvent(
      new CustomEvent("computerNamespaceAdded", {
        detail: {
          computerId,
          namespaceAlias,
        },
      }),
    );
  }
}

export const ComputerManagerContext = createContext(
  new ComputerManager(new NamespaceManager()),
);
