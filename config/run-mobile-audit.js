import { spawn } from "node:child_process";
import { createServer } from "vite";

const server = await createServer({
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});

let exitCode = 1;

try {
  await server.listen();

  const testProcess = spawn(
    process.execPath,
    [
      "node_modules/@playwright/test/cli.js",
      "test",
      "tests/home-mobile-geometry.spec.js",
      ...process.argv.slice(2),
    ],
    { stdio: "inherit" },
  );

  exitCode = await new Promise((resolve, reject) => {
    testProcess.once("error", reject);
    testProcess.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await server.close();
}

process.exitCode = exitCode;
