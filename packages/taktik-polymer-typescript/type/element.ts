/**
 * Custom Elements v1
 *
 * Based on https://www.w3.org/TR/2016/WD-custom-elements-20160830/
 */

interface CustomElementRegistry {
  define(name: string, constructor: Function, options?: ElementDefinitionOptions): void;
  get(name: string): any;
  whenDefined(name: string): Promise<void>;
}

interface ElementDefinitionOptions {
  extends: string;
}

