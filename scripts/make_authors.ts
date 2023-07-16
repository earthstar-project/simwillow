import { exportKeyJwk, makeKeypair } from "../src/protocol.ts";

const authors = [
  "Alfie",
  "Betty",
  "Gemma",
  "Dalton",
  "Epson",
];

const keypairs: Record<
  string,
  { publicKey: JsonWebKey; privateKey: JsonWebKey }
> = {};

for (const author of authors) {
  const keypair = await makeKeypair();

  const pubJwk = await exportKeyJwk(keypair.publicKey);
  const privateJwk = await exportKeyJwk(keypair.privateKey);

  keypairs[author] = {
    publicKey: pubJwk,
    privateKey: privateJwk,
  };
}

const json = JSON.stringify(keypairs);

await Deno.writeTextFile("./src/authors.json", json);
