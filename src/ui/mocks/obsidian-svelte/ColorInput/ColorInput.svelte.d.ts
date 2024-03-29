import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the color value.
     */ value: string;
  };
  events: {
    input: Event;
    change: Event;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type ColorInputProps = typeof __propDef.props;
export declare type ColorInputEvents = typeof __propDef.events;
export declare type ColorInputSlots = typeof __propDef.slots;
export default class ColorInput extends SvelteComponentTyped<
  ColorInputProps,
  ColorInputEvents,
  ColorInputSlots
> {}
export {};
