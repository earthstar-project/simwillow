import {
  signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Replica } from "willow";

function ReplicaWidget({ replica }: { replica: Replica<CryptoKeyPair> }) {
  return (
    <div>
      <header>
        <h1>
          {replica.namespace}
        </h1>
        <div>
          A replica is a snapshot of a namespace's data in (distributed) time.
          It's your own view of a namespace's data, with just the bits you care
          about inside.
        </div>
      </header>

      <section>
        <h2>Entries</h2>
        <div>Show entries here</div>
        <button>Add a new entry</button>
      </section>
    </div>
  );
}
