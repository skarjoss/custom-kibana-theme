import { schema, TypeOf } from '@kbn/config-schema';

export const configSchema = schema.object({
  brandName: schema.string({ defaultValue: 'Whales Tales' }),
  primaryColor: schema.string({ defaultValue: 'darkblue' }),
  logoNoTextFile: schema.string({ defaultValue: 'whale-tales-logo-no-text.png' }),
  logoFile: schema.string({ defaultValue: 'whale-tales-logo.png' }),
  faviconFile: schema.string({ defaultValue: 'whale-tales-logo-icon.ico' }),
});

export type Config = TypeOf<typeof configSchema>;

export interface PublicConfig {
  brandName: string;
  primaryColor: string;
  logoNoTextFile: string;
  logoFile: string;
  faviconFile: string;
}
