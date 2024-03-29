import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    href: string;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type LinkProps = typeof __propDef.props;
export declare type LinkEvents = typeof __propDef.events;
export declare type LinkSlots = typeof __propDef.slots;
export default class Link extends SvelteComponentTyped<
  LinkProps,
  LinkEvents,
  LinkSlots
> {}
export {};
