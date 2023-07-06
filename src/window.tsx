import { useContext, useState } from "preact/hooks";
import { ComponentChildren } from "preact";
import { useDrag } from "react-use-gesture";
import { DesktopManagerContext } from "./desktop_manager.ts";

export function Window(
  { children, toolbar = true, itemId, title }: {
    children: ComponentChildren;
    toolbar?: boolean;
    title?: string;
    itemId: string;
  },
) {
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const bind = useDrag((state: { delta: [number, number] }) => {
    const [x, y] = state.delta;

    requestAnimationFrame(() => {
      setXPos((prev) => prev + x);
      setYPos((prev) => prev + y);
    });
  }, {
    eventOptions: {
      capture: false,
    },
  });

  const desktopManager = useContext(DesktopManagerContext);

  if (toolbar === false) {
    return (
      <div
        {...bind()}
        style={{
          position: "absolute",
          transform: `translate(${xPos}px, ${yPos}px)`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${xPos}px, ${yPos}px)`,
      }}
    >
      <div
        className="window-toolbar"
        {...bind()}
      >
        <button
          onClick={() => {
            desktopManager.removeItem(itemId);
          }}
        >
          x
        </button>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
