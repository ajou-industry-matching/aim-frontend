/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const isVitest = process.env.VITEST === "true";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(dirname, "./src"),
      },
    },
    ...(isVitest
      ? {
          test: {
            projects: [
              {
                extends: true,
                plugins: [
                  (await import("@storybook/addon-vitest/vitest-plugin")).storybookTest({
                    configDir: path.join(dirname, ".storybook"),
                  }),
                ],
                test: {
                  name: "storybook",
                  browser: {
                    enabled: true,
                    headless: true,
                    provider: (await import("@vitest/browser-playwright")).playwright({}),
                    instances: [{ browser: "chromium" }],
                  },
                  setupFiles: [".storybook/vitest.setup.ts"],
                },
              },
            ],
          },
        }
      : {}),
  };
});
