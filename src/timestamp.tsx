import { useMemo } from "preact/hooks";

export function Timestamp({ timestamp }: { timestamp: bigint }) {
  const formatted = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(Number(timestamp) / 1000);
  }, [timestamp]);

  return <span title={`${timestamp}`}>{formatted}</span>;
}
