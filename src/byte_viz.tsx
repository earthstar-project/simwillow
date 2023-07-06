import { useEffect, useRef } from "preact/hooks";
import { encode as encodeBase32 } from "std_base32";

const colours = [
  [0, 0, 0],
  [230, 159, 0],
  [86, 180, 233],
  [0, 158, 115],
  [240, 228, 66],
  [0, 114, 174],
  [213, 94, 0],
  [204, 121, 167],
];

function generateCombinations() {
  const combos = [];

  for (let i = 0; i < colours.length; i++) {
    for (let j = 0; j < colours.length; j++) {
      if (i === j) {
        combos.push([
          [255, 255, 255],
          colours[j],
        ]);

        continue;
      }

      combos.push([
        colours[i],
        colours[j],
      ]);
    }
  }

  return combos;
}

const allCombinations = generateCombinations();

function getColourCombination(n: number) {
  const index = Math.floor(n / 4);

  return allCombinations[index];
}

function getShape(n: number): "tl" | "tr" | "bl" | "br" {
  const res = n / 4;
  const floored = Math.floor(res);

  const diff = res - floored;

  switch (diff) {
    case 0:
      return "tl";
    case 0.25:
      return "tr";
    case 0.5:
      return "bl";
    case 0.75:
      return "br";

    default:
      console.warn("ahhhh");
      return "tl";
  }
}

export function ByteViz({ height, rows, bytes }: {
  height: number;
  rows: number;
  bytes: Uint8Array;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      // boo
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      // boo
      return;
    }

    const sideSize = height / rows;

    let row = 0;
    let column = 0;

    for (let i = 0; i < bytes.byteLength; i++) {
      console.log({ i, row, column });

      const byte = bytes[i];
      const colourCombo = getColourCombination(byte);
      const shape = getShape(byte);

      // background square

      context.fillStyle = `rgb(${colourCombo[0][0]}, ${colourCombo[0][1]}, ${
        colourCombo[0][2]
      })`;
      context.fillRect(sideSize * column, sideSize * row, sideSize, sideSize);

      // the other three squares

      context.fillStyle = `rgb(${colourCombo[1][0]}, ${colourCombo[1][1]}, ${
        colourCombo[1][2]
      })`;

      if (shape !== "tl") {
        context.fillRect(
          sideSize * column,
          sideSize * row,
          sideSize / 2,
          sideSize / 2,
        );
      }

      if (shape !== "tr") {
        context.fillRect(
          sideSize * column + sideSize / 2,
          sideSize * row,
          sideSize / 2,
          sideSize / 2,
        );
      }

      if (shape !== "bl") {
        context.fillRect(
          sideSize * column,
          sideSize * row + sideSize / 2,
          sideSize / 2,
          sideSize / 2,
        );
      }

      if (shape !== "br") {
        context.fillRect(
          sideSize * column + sideSize / 2,
          sideSize * row + sideSize / 2,
          sideSize / 2,
          sideSize / 2,
        );
      }

      if (row + 1 >= rows) {
        row = 0;
        column += 1;
      } else {
        row += 1;
      }
    }
  }, []);

  return (
    <canvas
      title={encodeBase32(bytes)}
      style={{
        borderRadius: height / 2 / rows,
      }}
      ref={canvasRef}
      height={height}
      width={bytes.byteLength * (height / rows) / rows}
    />
  );
}

/*
export function ByteViz({ height, rows, bytes }: {
  height: number;
  rows: number;
  bytes: Uint8Array;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      // boo
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      // boo
      return;
    }

    const sideSize = height / rows;

    let row = 0;
    let column = 0;

    for (let i = 0; i < bytes.byteLength; i++) {
      const red = bytes[i];
      const green = bytes[i + 1] || 255;
      const blue = bytes[i + 2] || 255;

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

      const centerX = sideSize * column + (sideSize / 2);
      const centerY = sideSize * row + (sideSize / 2);

      console.log({ centerX, centerY, radius: sideSize / 2 });

      context.beginPath();

      context.ellipse(
        centerX,
        centerY,
        sideSize / 2.5,
        sideSize / 2.5,
        0,
        0,
        Math.PI * 2,
      );

      context.fill();

      if (row + 1 > rows) {
        row = 0;
        column += 1;
      } else {
        row += 1;
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={bytes.byteLength * (height / rows)}
    />
  );
}
*/

/*
export function ByteViz({ height, rows, bytes }: {
  height: number;
  rows: number;
  bytes: Uint8Array;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      // boo
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      // boo
      return;
    }

    const sideSize = height / rows;

    let row = 0;
    let column = 0;

    for (let i = 0; i < bytes.byteLength; i++) {
      const red = bytes[i];
      const green = bytes[i + 1] || 255;
      const blue = bytes[i + 2] || 255;

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

      context.fillRect(sideSize * column, sideSize * row, sideSize, sideSize);

      if (row + 1 > rows) {
        row = 0;
        column += 1;
      } else {
        row += 1;
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={bytes.byteLength * (height / rows)}
    />
  );
}
*/
