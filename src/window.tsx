import { useState } from "preact/hooks";
import { ComponentChildren } from "preact";
import { useDrag } from "react-use-gesture";

export function Window({ children }: { children: ComponentChildren }) {
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  console.log("yay");

  const bind = useDrag((state: { delta: [number, number] }) => {
    const [x, y] = state.delta;

    requestAnimationFrame(() => {
      setXPos((prev) => prev + x);
      setYPos((prev) => prev + y);
    });
  });

  return (
    <div
      {...bind()}
      style={{
        position: "relative",
        transform: `translate(${xPos}px, ${yPos}px)`,
      }}
    >
      {children}
    </div>
  );
}
