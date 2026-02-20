import type { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import type { Config } from '../config';
import { configSchema } from '../config';

export const config: PluginConfigDescriptor<Config> = {
  exposeToBrowser: {
    brandName: true,
    primaryColor: true,
    logoNoTextFile: true,
    logoFile: true,
    faviconFile: true,
  },
  schema: configSchema,
};

export async function plugin(initializerContext: PluginInitializerContext) {
  const { CustomKibanaThemeServerPlugin } = await import('./plugin');
  return new CustomKibanaThemeServerPlugin(initializerContext);
}
