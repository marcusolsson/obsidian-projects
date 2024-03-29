import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the date value.
     */ value: Date | null;
    /**
     * Specifies whether to remove decorations so that it can be embedded in other
     * components.
     */ embed?: boolean | undefined;
  };
  events: {
    blur: FocusEvent;
    change: CustomEvent<Date | null>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type DatetimeInputProps = typeof __propDef.props;
export declare type DatetimeInputEvents = typeof __propDef.events;
export declare type DatetimeInputSlots = typeof __propDef.slots;
export default class DatetimeInput extends SvelteComponentTyped<
  DatetimeInputProps,
  DatetimeInputEvents,
  DatetimeInputSlots
> {}
export {};
