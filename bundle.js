import { execa } from "execa";
import fs from "fs";

const dir = "src-tauri/binaries";
let extension = "";
if (process.platform === "win32") {
  extension = ".exe";
}

async function main() {
  const rustInfo = (await execa("rustc", ["-vV"])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
  if (!targetTriple) {
    console.error("Failed to determine platform target triple");
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log(
    `Moving "server${extension}" to "${dir}/server-${targetTriple}${extension}"`
  );
  fs.renameSync(
    `server${extension}`,
    `${dir}/server-${targetTriple}${extension}`
  );
}

main().catch((e) => {
  throw e;
});
