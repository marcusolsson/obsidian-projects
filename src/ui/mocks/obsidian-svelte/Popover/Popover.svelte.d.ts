import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the element to anchor the menu to.
     */ anchorEl: HTMLElement;
    /**
     * Specifies whether the menu is open or not.
     */ open: boolean;
    /**
     * Specifies whether the class name to use for the popover element.
     */ className?: string | undefined;
    /**
     * Specifies a function to run when the popover closes.
     */ onClose?: (() => void) | undefined;
    /**
     * Specifices where to place the menu in relation to the anchor element.
     */ placement?:
      | "auto"
      | "auto-start"
      | "auto-end"
      | "top"
      | "bottom"
      | "right"
      | "left"
      | "top-start"
      | "top-end"
      | "bottom-start"
      | "bottom-end"
      | "right-start"
      | "right-end"
      | "left-start"
      | "left-end"
      | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type PopoverProps = typeof __propDef.props;
export declare type PopoverEvents = typeof __propDef.events;
export declare type PopoverSlots = typeof __propDef.slots;
export default class Popover extends SvelteComponentTyped<
  PopoverProps,
  PopoverEvents,
  PopoverSlots
> {}
export {};
