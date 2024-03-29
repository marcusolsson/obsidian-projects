import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    text: string;
    value: string;
    disabled?: boolean | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type SelectItemProps = typeof __propDef.props;
export declare type SelectItemEvents = typeof __propDef.events;
export declare type SelectItemSlots = typeof __propDef.slots;
export default class SelectItem extends SvelteComponentTyped<
  SelectItemProps,
  SelectItemEvents,
  SelectItemSlots
> {}
export {};
