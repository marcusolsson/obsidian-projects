import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the available options.
     */ options: {
      label: string;
      value: string;
    }[];
    /**
     * Specifies the selected value.
     */ value: string;
    /**
     * Specifies the placeholder text.
     */ placeholder?: string | undefined;
    /**
     * Specifies whether to allow empty values.
     */ allowEmpty?: boolean | undefined;
    /**
     * Specifies whether the select is disabled.
     */ disabled?: boolean | undefined;
    /**
     * Specifies the tooltip.
     */ tooltip?: string | undefined;
  };
  events: {
    change: CustomEvent<string>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type SelectProps = typeof __propDef.props;
export declare type SelectEvents = typeof __propDef.events;
export declare type SelectSlots = typeof __propDef.slots;
export default class Select extends SvelteComponentTyped<
  SelectProps,
  SelectEvents,
  SelectSlots
> {}
export {};
