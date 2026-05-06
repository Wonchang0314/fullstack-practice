import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:4000/api-spec.json",
  output: { path: "src/api" },
  plugins: ["@hey-api/client-axios", "@tanstack/react-query"],
});
