import { ComponentChildren } from "preact";
import { InfoButton } from "./info_button.tsx";

export type InfoContents = {
  id: string;
  title: ComponentChildren;
  children: ComponentChildren;
};

export const InfoButtonClicked: InfoContents = {
  id: "info_button_tutorial",
  title: "You did it!",
  children: <div>Your thirst for knowledge is enviable.</div>,
};

export const Intro: InfoContents = {
  id: "welcome",
  title: <>Sick SimWillow Logo</>,
  children: (
    <>
      <p>Welcome to SimWillow!</p>
      <p>
        The Willow General Sync Protocol is a building block for a new
        generation of applications which need:
        <ul>
          <li>local-first storage</li>
          <li>fine-grained user permissions</li>
          <li>data editing and deletion</li>
          <li>multiple authors</li>
          <li>efficiency</li>
        </ul>
      </p>
      <p>
        Willow has been designed in a very generic way so that it bends to your
        needs, and not the other way around.
      </p>
      <p>
        SimWillow tries to make it easy and fun to learn the concepts and
        procedures of Willow, so you can imagine how its pieces can be molded
        and put to your noble ends.
      </p>
      <p>
        We have put a lot of <InfoButton info={InfoButtonClicked} />{" "}
        buttons around the app. If you ever want to learn more about a concept,
        click it!
      </p>
      <p>
        To get started, try either of the two options here:
        <ul>
          <button>Add computer</button>
          <button>Namespaces</button>
        </ul>
      </p>
      <p>
        This app is a work in progress, and currently only has UI built to
        demonstrate the data model. Syncing and capabilities will come in time!
      </p>
      <hr />
      <p>
        Still here? What can I tell you...?
      </p>
      <p>
        SimWillow is built on top of willow-js so that we know it behaves
        exactly as it really would.
      </p>
      <p>
        Willow is a generic protocol which lets you decide what is best for your
        application. Stuff like path formats, hashing function, signature
        scheme, and transport used for syncing. For example: SimWillow uses
        simple encoded strings for paths, SHA 256 for hashing, and ECDSA
        keypairs.
      </p>
    </>
  ),
};

export const Namespaces: InfoContents = {
  id: "namespaces",
  title: "What are namespaces?",
  children: (
    <>
      <p>
        Rather than putting data into a global namespace, Willow has a concept
        of namespaces. Namespaces are completely disjoint from one another, and
        share no data with each other.
      </p>
      <p>
        In applications, these can be used as a tool for implementing
        conceptually separate spaces, e.g. around a pre-existing community, or
        interest.
      </p>
      <p>
        An entry belonging to one namespace{" "}
        <em>cannot cross over into another namespace</em>.
      </p>
      <p>
        A device using Willow can be interested in many namespaces, and will
        securely determine which namespaces are held in common with any peers it
        tries to sync with.
      </p>
      <p>
        In SimWillow, namespaces appear to user as friendly names like "Book
        Club". Under the hood, SimWillow models namespaces as ECDSA keypairs.
        But this is not hardcoded into Willow, and you can use whatever you want
        as namespace identifiers.
      </p>
    </>
  ),
};

export const Replicas: InfoContents = {
  id: "replicas",
  title: "What are replicas?",
  children: (
    <>
      <p>
        For each namespace <InfoButton info={Namespaces} />{" "}
        a device has interest in, it will have a corresponding replica.
      </p>

      <p>
        A replica is a device's own copy of a namespace's data. This copy is
        always available to read from or write to, even when that device is
        offline. There is no centralised namespace 'out there' to pull from.
      </p>

      <p>
        Replicas from different devices are able to sync with one another,
        deterministically reconciling their differences so that different
        devices can collaborate with each other.
      </p>

      <p>
        A replica holds many entries, each with a corresponding payload. The
        entry describes the payload, and the payload is the actual data being
        shared: a message, image, song, etc.
      </p>

      <p>
        Replicas can choose which entries they're interested in syncing, and
        which payloads they actually want to hold in storage. It's possible to
        store an entry without storing the payload.
      </p>

      <p>
        Replicas are also free to forget entries and payloads without causing
        any disruption to other peer's replicas.
      </p>
    </>
  ),
};

export const EntryCreation: InfoContents = {
  id: "entry_creation",
  title: "Creating new entries",
  children: (
    <>
      <p>
        Whenever we want to add some data (or 'payload') into a namespace, we
        have to create a corresponding entry for it. For this we need at least
        three things: the payload in question, a path, and valid credentials for
        authoring an entry.
      </p>
      <p>
        Entries contain a lot of information which is derived from these, such
        as a payload hash, payload length, and cryptographic signatures.
      </p>
      <p>
        As you create new entries, they will be shown in this device's replica
        window.Here's some things you should try:
      </p>
      <ul>
        <li>
          What happens if you create an entry on the same path with two
          different authors?
        </li>
        <li>
          What happens if you create an entry on the same path with{" "}
          <em>the same</em> author?
        </li>
        <li>
          What happens if you create an entry whose path is a prefix of another
          entry, and whose author is the same?!
        </li>
      </ul>
      <p>
        An entry's timestamp can be manually specified, but in SimWillow we just
        use the time the entry was created. Similarly a payload can be any
        arbitrary sequence of bytes, but here we just let you input text.
      </p>
      <p>
        Finally, the form of credentials or signature scheme is not hard-coded
        into Willow. In SimWillow, authors are modelled as ECDSA keypairs which
        are used to sign entries and verify their signatures. But Willow is able
        to support full-blown capability systems e.g. UCANs.
      </p>
    </>
  ),
};

export const Entries: InfoContents = {
  id: "entries",
  title: "What are entries?",
  children: (
    <>
      <p>
        For every payload which is added to a namespace, a signed entry is
        created for it. This data enables Willow to sync different replicas,
        reconcile their differences, and refuse forged data.
      </p>
    </>
  ),
};

export const EntryTimestamp: InfoContents = {
  id: "entry_timestamp",
  title: "Entry timestamps",
  children: (
    <>
      <p>
        Willow uses wall-clock timestamps: microseconds elapsed since the UNIX
        epoch.
      </p>

      <p>
        If you are familiar with distributed systems, this may seem like a rude
        awakening, like opening up a computer only to find one of the components
        is a rubber band. But sometimes,{" "}
        <em>sometimes</em>, a rubber band is good enough.
      </p>
    </>
  ),
};

export const EntryHash: InfoContents = {
  id: "entry_hash",
  title: "Entry hashes",
  children: (
    <>
      <p>
        An entry's record stores a hash of the given payload, so that a replica
        can determine that a payload received from another peer has not been
        altered.
      </p>

      <p>
        The hashing function used is up to you. SimWillow uses the browser's
        built-in SHA256 hash function, but you can use something faster or more
        collision resistant depending on the specific application.
      </p>
    </>
  ),
};

export const EntryIdentifier: InfoContents = {
  id: "entry_identifier",
  title: "Entry identifiers",
  children: (
    <>
      <p>
        An entry's identifier contains three values:
      </p>
      <ul>
        <li>Which namespace this entry belongs to,</li>
        <li>The path chosen to store this entry under,</li>
        <li>and the author who created and signed this entry.</li>
      </ul>
      <p>
        A replica holds only one entry for a given combination of path and
        author. Different authors can write to the same path without affecting
        each other's entries.
      </p>

      <p>
        When choosing between two entries with the same path author, the replica
        will prefer the newer one.
      </p>

      <p>
        Ingestion of an entry with a path which is a prefix of another entry's
        path <em>and</em>{" "}
        newer than that entry will cause that older entry to be removed
        entirely. This is called prefix-based deletion, and it allows Willow to
        remove many entries and their details with a single entry in their
        place.
      </p>

      <p>
        If you want to know what 'newer' means, learn more about Willow's
        scandalous wall-clock timestamps. <InfoButton info={EntryTimestamp} />
      </p>.
    </>
  ),
};

export const Computers: InfoContents = {
  id: "computers",
  title: "What are... computers...?",
  children: (
    <>
      <p>
        Willow itself doesn't have a notion of devices, so this is a SimWillow
        abstraction for visualising how networks of devices interact.
      </p>
      <p>
        A computer within SimWillow's context is a grouping of namespaces{" "}
        <InfoButton info={Namespaces} />{" "}
        a hypothetical device is interested in, and the replicas it keeps for
        each of them.
      </p>
      <p></p>
    </>
  ),
};
