import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    title: string;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type ModalLayoutProps = typeof __propDef.props;
export declare type ModalLayoutEvents = typeof __propDef.events;
export declare type ModalLayoutSlots = typeof __propDef.slots;
export default class ModalLayout extends SvelteComponentTyped<
  ModalLayoutProps,
  ModalLayoutEvents,
  ModalLayoutSlots
> {}
export {};
