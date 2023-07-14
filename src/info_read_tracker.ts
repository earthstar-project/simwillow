import { createContext } from "preact";

export class InfoReadTracker extends EventTarget {
  private registry = new Map<string, boolean>();

  constructor() {
    super();
  }

  register(id: string) {
    if (this.registry.has(id)) {
      return;
    }

    this.registry.set(id, false);
  }

  setReadStatus(id: string, read: boolean) {
    this.registry.set(id, read);

    this.dispatchEvent(
      new CustomEvent("inforeadchange", {
        detail: {
          id,
        },
      }),
    );
  }

  isRead(id: string) {
    return !!this.registry.get(id);
  }
}

export const InfoReadTrackerContext = createContext(new InfoReadTracker());
