import common from '../locales/uk/common.json';

export interface MessageSchema {
  common: typeof common;
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}
