/** @typedef {typeof __propDef.props}  LoadingProps */
/** @typedef {typeof __propDef.events}  LoadingEvents */
/** @typedef {typeof __propDef.slots}  LoadingSlots */
export default class Loading extends SvelteComponentTyped<
  {},
  {
    [evt: string]: CustomEvent<any>;
  },
  {}
> {}
export type LoadingProps = typeof __propDef.props;
export type LoadingEvents = typeof __propDef.events;
export type LoadingSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {};
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export {};
