import { useContext, useEffect, useState } from "preact/hooks";
import { DesktopManagerContext } from "./desktop_manager.ts";
import { InfoContents } from "./info_contents.tsx";
import { WindowContext } from "./window.tsx";
import { InfoReadTrackerContext } from "./info_read_tracker.ts";

export function InfoButton({ info }: { info: InfoContents }) {
  const desktopManager = useContext(DesktopManagerContext);
  const infoReadTracker = useContext(InfoReadTrackerContext);

  const { position } = useContext(WindowContext);

  const hasBeenRead = infoReadTracker.isRead(info.id);

  const [_, bump] = useState(false);

  useEffect(() => {
    infoReadTracker.register(info.id);

    const callback = (event: Event) => {
      const id = (event as CustomEvent).detail["id"];

      if (id !== info.id) {
        return;
      }

      bump((prev) => !prev);
    };

    infoReadTracker.addEventListener("inforeadchange", callback);

    return () => {
      infoReadTracker.removeEventListener("inforeadchange", callback);
    };
  }, [info.id]);

  return (
    <button
      className={`info-button ${hasBeenRead ? "read" : "unread"}`}
      onClick={() => {
        desktopManager.addInfoItem(info, {
          x: position.x + 10,
          y: position.y + 10,
        });

        infoReadTracker.setReadStatus(info.id, true);
      }}
    >
      <span>
        ℹ
      </span>
    </button>
  );
}
