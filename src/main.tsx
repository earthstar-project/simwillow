import { render } from "preact";
import { Desktop } from "./desktop.tsx";

function SimWillow() {
  return (
    <div>
      <Desktop>
        <span>Hi!</span>
      </Desktop>
    </div>
  );
}

const el = document.getElementById("root");

if (el) {
  render(<SimWillow />, el);
}
