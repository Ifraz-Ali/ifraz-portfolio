import { createGuide } from "./guide-character.mjs";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";

const root = createGuide();
// GLTFExporter uses the browser FileReader interface for binary assembly.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob
      .arrayBuffer()
      .then((result) => {
        this.result = result;
        this.onloadend?.();
      })
      .catch((error) => this.onerror?.(error));
  }
  readAsDataURL(blob) {
    blob
      .arrayBuffer()
      .then((result) => {
        this.result =
          "data:application/octet-stream;base64," +
          Buffer.from(result).toString("base64");
        this.onloadend?.();
      })
      .catch((error) => this.onerror?.(error));
  }
};
const output = await new GLTFExporter().parseAsync(root, {
  binary: true,
  trs: true,
});
await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../public/models/portfolio-guide.glb", import.meta.url),
  Buffer.from(output),
);
console.log(
  `Saved original guide model: ${Math.round(output.byteLength / 1024)} KiB`,
);
