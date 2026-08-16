import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results",
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: "msedge",
    viewport: {
      width: 360,
      height: 900,
    },
    deviceScaleFactor: 1,
    screenshot: "only-on-failure",
    trace: "off",
    video: "off",
  },
});
