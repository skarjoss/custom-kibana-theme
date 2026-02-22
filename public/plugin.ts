import { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from '../../../src/core/public';
import type { PublicConfig } from '../common/config';
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_FAVICON_FILE,
  DEFAULT_LOGO_FILE,
  DEFAULT_LOGO_NO_TEXT_FILE,
  DEFAULT_PRIMARY_COLOR,
  PLUGIN_ASSETS_BASE_PATH,
} from './consts';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomKibanaThemePluginContract {}
interface FaviconConfig {
  emoji?: string;
  href?: string;
}

export class CustomKibanaThemePlugin
  implements Plugin<CustomKibanaThemePluginContract, CustomKibanaThemePluginContract>
{
  private curAppClass?: string;
  private readonly brandName: string;
  private readonly primaryColor: string;
  private readonly logoNoTextFile: string;
  private readonly logoFile: string;
  private readonly faviconFile: string;

  constructor(initializerContext: PluginInitializerContext<PublicConfig>) {
    const config = initializerContext.config.get<PublicConfig>();
    this.brandName = (config.brandName || DEFAULT_BRAND_NAME).trim() || DEFAULT_BRAND_NAME;
    this.primaryColor = (config.primaryColor || DEFAULT_PRIMARY_COLOR).trim() || DEFAULT_PRIMARY_COLOR;
    this.logoNoTextFile = this.sanitizeAssetFileName(config.logoNoTextFile, DEFAULT_LOGO_NO_TEXT_FILE);
    this.logoFile = this.sanitizeAssetFileName(config.logoFile, DEFAULT_LOGO_FILE);
    this.faviconFile = this.sanitizeAssetFileName(config.faviconFile, DEFAULT_FAVICON_FILE);

    console.log('Loaded CustomKibanaThemePlugin');

    this.setupTabNameListener();
  }

  public setup(core: CoreSetup): CustomKibanaThemePluginContract {
    this.applyBrandingStyleVariables(core);

    // Update the favicon programatically
    this.changeFavicon({
      href: core.http.basePath.prepend(`${PLUGIN_ASSETS_BASE_PATH}/${this.faviconFile}`),
      // also supports an emoji favicon
      // emoji: '🐋',
    });

    // Registration is done here so not to miss the first event
    core.getStartServices().then((start) => {
      // Set a custom class to the body to scope css changes
      start[0].application.currentAppId$.subscribe((currApp) => {
        this.setBodyClass(currApp);
      });
    });

    return {};
  }

  public start(_core: CoreStart): CustomKibanaThemePluginContract {
    // You can place programmatic hooks here
    return {};
  }

  public stop() {}

  // Changes the favicon
  private changeFavicon({ emoji, href }: FaviconConfig) {
    let faviconHref: string | undefined = undefined;

    if (href) {
      faviconHref = href;
    } else if (emoji) {
      const canvas = document.createElement('canvas');
      canvas.height = 64;
      canvas.width = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.font = '64px serif';
      ctx.fillText('🐋', 0, 64);

      faviconHref = canvas.toDataURL();
    }

    if (faviconHref) {
      const link = document.createElement('link');
      const oldLinks = document.querySelectorAll('link[rel~="icon"]');
      oldLinks.forEach((e) => e.parentNode?.removeChild(e));
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = faviconHref;
      document.head.appendChild(link);
    }
  }

  private applyBrandingStyleVariables(core: CoreSetup) {
    const logoNoTextUrl = core.http.basePath.prepend(`${PLUGIN_ASSETS_BASE_PATH}/${this.logoNoTextFile}`);
    const logoUrl = core.http.basePath.prepend(`${PLUGIN_ASSETS_BASE_PATH}/${this.logoFile}`);
    const root = document.documentElement;
    root.style.setProperty('--ckl-welcome-text', this.toCssContentValue(`Welcome to ${this.brandName}`));
    root.style.setProperty(
      '--ckl-logout-text',
      this.toCssContentValue(`You have logged out of ${this.brandName}.`)
    );
    root.style.setProperty('--ckl-primary-color', this.primaryColor);
    root.style.setProperty('--ckl-logo-no-text-url', this.toCssUrlValue(logoNoTextUrl));
    root.style.setProperty('--ckl-logo-url', this.toCssUrlValue(logoUrl));
  }

  private toCssContentValue(value: string) {
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  private toCssUrlValue(value: string) {
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `url('${escaped}')`;
  }

  private sanitizeAssetFileName(value: string | undefined, fallback: string) {
    const trimmed = (value || '').trim();
    if (!trimmed || trimmed.includes('/') || trimmed.includes('\\')) {
      return fallback;
    }

    return trimmed;
  }

  // Replaces the word `Elastic` in the tab name
  private setupTabNameListener() {
    const titleElement = document.querySelector('title');
    if (!titleElement) {
      return;
    }

    new MutationObserver(() => {
      const title = document.title;
      if (title) {
        let newTitle = document.title;
        // Replace in suffix
        if (newTitle.indexOf(' - Elastic') > -1) {
          newTitle = newTitle.replace(' - Elastic', '');
          newTitle = `${newTitle} | ${this.brandName}`;
        }
        // Replace in prefix
        if (newTitle === 'Elastic') {
          newTitle = this.brandName;
        }

        if (newTitle !== title) {
          document.title = newTitle;
        }
      }
    }).observe(titleElement, { subtree: true, characterData: true, childList: true });
  }

  // Sets a unique class to the body for each application
  private setBodyClass(curApp?: string) {
    // Remove old class name
    if (this.curAppClass) {
      document.body.classList.remove(this.curAppClass);
      this.curAppClass = undefined;
    }

    // Add new class name
    if (curApp) {
      this.curAppClass = `ckl-app-${curApp}`;
      document.body.classList.add(this.curAppClass);
    }
  }
}
