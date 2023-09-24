import { resolve } from 'node:path';
import jiti from 'jiti';

type PluginOptions = {
  file: string;
  validator: (module: any) => void;
};

async function validatorFn(options: PluginOptions) {
  // Load file using jiti
  const module = await jiti(options.file, {
    cache: false,
    v8cache: false,
    esmResolve: true,
    // FIXME: https://github.com/unjs/jiti/pull/141
    requireCache: false,
  })(options.file);

  // Call the validator function
  await options.validator(module);
}

/**
 * Plugin main function
 */
export const customValidator = (options: PluginOptions) => ({
  name: 'vite-plugin-custom-validator',
  config: async function () {
    options.file = resolve(options.file); // Convert to absolute path
    if (!(options.file || options.validator)) {
      throw new Error('Missing file or validator option for vite-plugin-custom-validator');
    }
    await validatorFn(options);
  },
  handleHotUpdate: async function ({ file: changedFile }: { file: string }) {
    options.file = resolve(options.file); // Convert to absolute path
    if ((changedFile ?? '').endsWith(options.file)) {
      try {
        await validatorFn(options);
      } catch (err) {
        console.error(err);
      }
    }
  },
});
