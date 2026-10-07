import { spawn } from "node:child_process";
// npm sets npm_execpath to its CLI script, so running it with node avoids the npm.cmd shim that spawn can't start on Windows.
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error("Start both servers with: npm run dev");
  process.exit(1);
}
const children = ["BackEnd", "FrontEnd"].map((directory) =>
  spawn(process.execPath, [npmCli, "run", "dev", "--prefix", directory], {
    stdio: "inherit",
  }),
);
let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null || child.signalCode !== null) continue;
    // On Windows, killing npm leaves its node or vite child running, so end the whole process tree.
    if (process.platform === "win32")
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    else child.kill("SIGTERM");
  }
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
children.forEach((child) => {
  child.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
    stop();
  });
  child.on("exit", (code) => {
    if (!stopping && code) {
      stop();
      process.exitCode = code;
    }
  });
});
