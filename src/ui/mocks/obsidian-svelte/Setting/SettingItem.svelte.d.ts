import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    name?: string | undefined;
    description?: string | undefined;
    heading?: boolean | undefined;
    vertical?: boolean | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type SettingItemProps = typeof __propDef.props;
export declare type SettingItemEvents = typeof __propDef.events;
export declare type SettingItemSlots = typeof __propDef.slots;
export default class SettingItem extends SvelteComponentTyped<
  SettingItemProps,
  SettingItemEvents,
  SettingItemSlots
> {}
export {};
