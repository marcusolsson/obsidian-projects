import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the title of the callout.
     */ title: string;
    /**
     * Specifies the icon next to the title.
     */ icon: string;
    /**
     * Specifies the variant of callout, which determines the color.
     */ variant:
      | "info"
      | "todo"
      | "tip"
      | "success"
      | "question"
      | "warning"
      | "failure"
      | "danger"
      | "bug"
      | "example"
      | "quote";
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type CalloutProps = typeof __propDef.props;
export declare type CalloutEvents = typeof __propDef.events;
export declare type CalloutSlots = typeof __propDef.slots;
export default class Callout extends SvelteComponentTyped<
  CalloutProps,
  CalloutEvents,
  CalloutSlots
> {}
export {};
