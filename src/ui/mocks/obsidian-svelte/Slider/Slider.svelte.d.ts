import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the value;
     */ value: number;
    /**
     * Specifies the minimum allowed value.
     */ min: number;
    /**
     * Specifies the maximum allowed value.
     */ max: number;
    /**
     * Specifies the step size.
     */ step: number;
  };
  events: {
    change: Event;
    input: Event;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type SliderProps = typeof __propDef.props;
export declare type SliderEvents = typeof __propDef.events;
export declare type SliderSlots = typeof __propDef.slots;
export default class Slider extends SvelteComponentTyped<
  SliderProps,
  SliderEvents,
  SliderSlots
> {}
export {};
