import { schema, TypeOf } from '@kbn/config-schema';

export const configSchema = schema.object({
  brandName: schema.string({ defaultValue: 'Whales Tales' }),
  primaryColor: schema.string({ defaultValue: 'darkblue' }),
  logoNoTextFile: schema.string({ defaultValue: 'cosmos-logo-no-text.png' }),
  logoFile: schema.string({ defaultValue: 'cosmos-logo.png' }),
  faviconFile: schema.string({ defaultValue: 'cosmos-logo-icon.jpg' }),
});

export type Config = TypeOf<typeof configSchema>;
