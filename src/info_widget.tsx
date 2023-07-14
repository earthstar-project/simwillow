import { InfoContents } from "./info_contents.tsx";

export function InfoWidget({ info }: { info: InfoContents }) {
  return (
    <div className={"widget info"}>
      {info.children}
    </div>
  );
}
