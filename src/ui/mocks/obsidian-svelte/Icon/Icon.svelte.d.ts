import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the icon identifier. Visit https://lucide.dev for all valid
     * identifiers.
     */ name: string;
    /**
     * Specifies the icon size.
     */ size?: "xs" | "sm" | "md" | "lg" | undefined;
    /**
     * Specifies whether to invert the icon color on accent backgrounds.
     */ accent?: boolean | undefined;
    /**
     * Specifies the tooltip text.
     */ tooltip?: string | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type IconProps = typeof __propDef.props;
export declare type IconEvents = typeof __propDef.events;
export declare type IconSlots = typeof __propDef.slots;
export default class Icon extends SvelteComponentTyped<
  IconProps,
  IconEvents,
  IconSlots
> {}
export {};
