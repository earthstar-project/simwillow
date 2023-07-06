import authorJson from "./authors.json" assert { type: "json" };
import { exportKey } from "./protocol.ts";
import { encode as encodeBase32 } from "std_base32";

const authorsMap: Map<string, CryptoKeyPair> = new Map();
const pubKeyToAuthorsMap: Map<string, string> = new Map();

for (const author in authorJson) {
  const { publicKey: publicKeyJwk, privateKey: privateKeyJwk } =
    authorJson[author];

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"],
  );

  const privateKey = await crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign"],
  );

  const pubKeyBytes = await exportKey(publicKey);
  const b32Pubkey = encodeBase32(new Uint8Array(pubKeyBytes));

  pubKeyToAuthorsMap.set(b32Pubkey, author);

  authorsMap.set(author, { publicKey, privateKey });
}

export const authors = authorsMap;
export const pubKeyAuthors = pubKeyToAuthorsMap;
