import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the variant of the button.
     */ variant?: ("default" | "destructive" | "primary" | "plain") | undefined;
    /**
     * Specifies whether the button is disabled.
     */ disabled?: boolean | undefined;
    /**
     * Specifies the text to display when hovering the button.
     */ tooltip?: string | undefined;
    /**
     * Specifies the reference for the underlying button element.
     */ ref?: HTMLButtonElement | null | undefined;
  };
  events: {
    click: MouseEvent;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<
  ButtonProps,
  ButtonEvents,
  ButtonSlots
> {}
export {};
