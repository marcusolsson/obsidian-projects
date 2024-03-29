import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies whether the checkbox is checked.
     */ checked: boolean;
    /**
     * Specifies whether the checkbox is disabled.
     */ disabled?: boolean | undefined;
  };
  events: {
    keypress: KeyboardEvent;
    check: CustomEvent<boolean>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type SwitchProps = typeof __propDef.props;
export declare type SwitchEvents = typeof __propDef.events;
export declare type SwitchSlots = typeof __propDef.slots;
export default class Switch extends SvelteComponentTyped<
  SwitchProps,
  SwitchEvents,
  SwitchSlots
> {}
export {};
