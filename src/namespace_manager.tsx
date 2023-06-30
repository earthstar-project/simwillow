import { createContext } from "preact";
import { makeKeypair } from "./protocol.ts";

export class NamespaceManager extends EventTarget {
  private namespaces = new Map<string, CryptoKeyPair>();

  async addNamespace(displayName: string) {
    if (this.namespaces.has(displayName)) {
      return;
    }

    const keypair = await makeKeypair();

    this.namespaces.set(displayName, keypair);

    this.dispatchEvent(new CustomEvent("namespaceAdded"));
  }

  removeNamespace(displayName: string) {
    if (!this.namespaces.has(displayName)) {
      return;
    }

    this.namespaces.delete(displayName);

    this.dispatchEvent(new CustomEvent("namespaceRemoved"));
  }

  getNamespaces() {
    return Array.from(this.namespaces.entries());
  }
}

export const NamespaceManagerContext = createContext(new NamespaceManager());
