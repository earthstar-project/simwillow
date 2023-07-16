import { ComponentChildren } from "preact";

export function NamespaceLabel({ children }: { children: ComponentChildren }) {
  return <span className="namespace-label">{children}</span>;
}
