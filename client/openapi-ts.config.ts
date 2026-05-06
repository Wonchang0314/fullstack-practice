import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:4000/api-spec.json',
  output: { path: 'src/client' },
  plugins: [
    '@hey-api/client-axios',
    '@tanstack/react-query',
  ],
});
