import {
  signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { ComponentChildren, createContext, toChildArray } from "preact";
import { useDrag } from "react-use-gesture";

import { Window } from "./window.tsx";

export function Desktop({ children }: { children: ComponentChildren }) {
  const childArray = toChildArray(children);

  return (
    <div>
      {childArray.map((child) => (
        <Window>
          {child}
        </Window>
      ))}
    </div>
  );
}
