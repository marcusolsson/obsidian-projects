import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the variant of text.
     */ variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "label";
    /**
     * Specifies whether to remove the default margin.
     */ nomargin?: boolean | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type TypographyProps = typeof __propDef.props;
export declare type TypographyEvents = typeof __propDef.events;
export declare type TypographySlots = typeof __propDef.slots;
export default class Typography extends SvelteComponentTyped<
  TypographyProps,
  TypographyEvents,
  TypographySlots
> {}
export {};
