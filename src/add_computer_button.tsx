import { useContext } from "preact/hooks";
import { ComputerManagerContext } from "./computer_manager.ts";

export function AddComputerButton() {
  const computerManager = useContext(ComputerManagerContext);

  return (
    <button
      onClick={() => {
        computerManager.addComputer();
      }}
    >
      Add computer
    </button>
  );
}
