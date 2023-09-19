# vite-plugin-custom-validator

Vite plugin to add a custom validator function at build or dev time (hot module update).

## Usage

```shell
$ pnpm add -D @kevbook/vite-plugin-custom-validator
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { customValidator } from 'vite-plugin-custom-validator';

export default defineConfig({
  plugins: [
    customValidator({
      file: 'src/server/config-schema.ts',
      validator: function (module) {
        module.validateConfigSchema(process.env);
      },
    }),
  ],
});
```
