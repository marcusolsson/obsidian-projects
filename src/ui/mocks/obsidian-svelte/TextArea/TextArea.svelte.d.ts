import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    value: string;
    rows: number;
    width?: string | undefined;
    placeholder?: string | undefined;
  };
  events: {
    input: CustomEvent<string>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type TextAreaProps = typeof __propDef.props;
export declare type TextAreaEvents = typeof __propDef.events;
export declare type TextAreaSlots = typeof __propDef.slots;
export default class TextArea extends SvelteComponentTyped<
  TextAreaProps,
  TextAreaEvents,
  TextAreaSlots
> {}
export {};
