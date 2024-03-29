import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the text label.
     */ label: string;
    /**
     * Specifies the icon.
     */ icon?: string | undefined;
    /**
     * Specifies whether the menu item is checked.
     */ checked?: boolean | undefined;
  };
  events: {
    click: MouseEvent;
    keypress: KeyboardEvent;
    check: CustomEvent<boolean>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type MenuItemProps = typeof __propDef.props;
export declare type MenuItemEvents = typeof __propDef.events;
export declare type MenuItemSlots = typeof __propDef.slots;
export default class MenuItem extends SvelteComponentTyped<
  MenuItemProps,
  MenuItemEvents,
  MenuItemSlots
> {}
export {};
