import { ProtocolParameters } from "../../willow-js/src/replica/types.ts";

export const protocolParameters: ProtocolParameters<CryptoKeyPair> = {
  hashLength: 32,
  pubkeyLength: 65,
  signatureLength: 64,
  sign: async (keypair, entryEncoded) => {
    const res = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      keypair.privateKey,
      entryEncoded,
    );

    return new Uint8Array(res);
  },
  hash: async (bytes: Uint8Array | ReadableStream<Uint8Array>) => {
    if (bytes instanceof Uint8Array) {
      return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
    }

    throw new Error(
      "We are not dealing with ReadableStreams in SimWillow!!!",
    );
  },
  verify: async (
    publicKey,
    signature,
    encodedEntry,
  ) => {
    const cryptoKey = await importPublicKey(publicKey);

    return crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      cryptoKey,
      signature,
      encodedEntry,
    );
  },
  async pubkeyBytesFromPair(pair) {
    const arrayBuffer = await exportKey(pair.publicKey);

    return new Uint8Array(arrayBuffer);
  },
};

export function makeKeypair() {
  return crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"],
  );
}

export function importPublicKey(raw: ArrayBuffer) {
  return crypto.subtle.importKey(
    "raw",
    raw,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"],
  );
}

export function exportKey(key: CryptoKey) {
  return window.crypto.subtle.exportKey("raw", key);
}

export function exportKeyJwk(key: CryptoKey) {
  return window.crypto.subtle.exportKey("jwk", key);
}
