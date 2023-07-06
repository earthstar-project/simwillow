import { createContext } from "preact";
import { exportKey, makeKeypair } from "./protocol.ts";
import { encode as encodeBase32 } from "std_base32";

export class NamespaceManager extends EventTarget {
  private namespaces = new Map<string, CryptoKeyPair>();
  private namespacesb32ToAlias = new Map<string, string>();

  async addNamespace(displayName: string) {
    if (this.namespaces.has(displayName)) {
      return;
    }

    const keypair = await makeKeypair();

    this.namespaces.set(displayName, keypair);

    const pubkeyBytes = await exportKey(keypair.publicKey);
    const pubkeyb32 = encodeBase32(new Uint8Array(pubkeyBytes));

    this.namespacesb32ToAlias.set(pubkeyb32, displayName);

    this.dispatchEvent(new CustomEvent("namespaceAdded"));
  }

  async removeNamespace(displayName: string) {
    const keypair = this.namespaces.get(displayName);

    if (!keypair) {
      return undefined;
    }

    this.namespaces.delete(displayName);

    const pubkeyBytes = await exportKey(keypair.publicKey);
    const pubkeyb32 = encodeBase32(new Uint8Array(pubkeyBytes));

    this.namespacesb32ToAlias.delete(pubkeyb32);

    this.dispatchEvent(new CustomEvent("namespaceRemoved"));
  }

  getNamespaceKeypair(displayName: string) {
    return this.namespaces.get(displayName);
  }

  getNamespaceAliasFromBase32(base32: string) {
    return this.namespacesb32ToAlias.get(base32);
  }

  getNamespaces() {
    return Array.from(this.namespaces.entries());
  }
}

export const NamespaceManagerContext = createContext(new NamespaceManager());
