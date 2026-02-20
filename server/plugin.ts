import type { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from '../../../src/core/server';

export class CustomKibanaThemeServerPlugin implements Plugin {
  constructor(_initializerContext: PluginInitializerContext) {}

  public setup(_core: CoreSetup) {}

  public start(_core: CoreStart) {}

  public stop() {}
}
