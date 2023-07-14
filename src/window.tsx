import { useContext, useState } from "preact/hooks";
import { ComponentChild, ComponentChildren, createContext } from "preact";
import { DesktopManagerContext } from "./desktop_manager.ts";
import { useDrag } from "react-use-gesture";

export const WindowContext = createContext({
  position: { x: 0, y: 0 },
});

export function Window(
  {
    children,
    toolbar = true,
    itemId,
    title,
    initialPos,
    zIndex,
    isHelp,
  }: {
    children: ComponentChildren;
    toolbar?: boolean;
    title?: ComponentChild;
    itemId: string;
    initialPos: { x: number; y: number };
    zIndex: number;
    isHelp?: boolean;
  },
) {
  const [xPos, setXPos] = useState(initialPos.x);
  const [yPos, setYPos] = useState(initialPos.y);

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
        onMouseDown={() => {
          desktopManager.bringItemToFore(itemId);
        }}
        style={{
          position: "absolute",
          transform: `translate(${xPos}px, ${yPos}px)`,
          zIndex,
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
        zIndex,
      }}
      className="window"
    >
      <WindowContext.Provider value={{ position: { x: xPos, y: yPos } }}>
        <div
          className={`window-toolbar ${isHelp ? "info" : ""}`}
          {...bind()}
          onMouseDown={() => {
            desktopManager.bringItemToFore(itemId);
          }}
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
      </WindowContext.Provider>
    </div>
  );
}
