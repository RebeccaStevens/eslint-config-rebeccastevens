import { settings as eslintComments } from './eslint-comments';
import { settings as functional } from './functional';
import { settings as importPlugin } from './import';
import { settings as jsdoc } from './jsdoc';
import { settings as markdown } from './markdown';
import { settings as optimizeRegex } from './optimize-regex';
import { settings as promise } from './promise';
import { settings as simpleImportSort } from './simple-import-sort';
import { settings as sonarjs } from './sonarjs';
import { settings as typescript } from './typescript';
import { settings as unicorn } from './unicorn';

export const plugins = [
  eslintComments,
  functional,
  importPlugin,
  jsdoc,
  markdown,
  optimizeRegex,
  promise,
  simpleImportSort,
  sonarjs,
  typescript,
  unicorn
];
