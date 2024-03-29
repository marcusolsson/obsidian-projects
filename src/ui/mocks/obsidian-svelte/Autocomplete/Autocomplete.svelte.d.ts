import { SvelteComponentTyped } from "svelte";
import type { Option } from "./types";
declare const __propDef: {
  props: {
    /**
     * Specifies the text input value.
     */ value: string;
    /**
     * Specifies all valid options.
     */ options: Option[];
    /**
     * Specifies the maximum number of options to display.
     */ maxItems?: number | undefined;
    /**
     * Specifies whether the options popover is open.
     */ open?: boolean | undefined;
    /**
     * TextInput props
     */ readonly?: boolean | undefined;
    placeholder?: string | undefined;
    width?: string | undefined;
    embed?: boolean | undefined;
    autoFocus?: boolean | undefined;
  };
  events: {
    change: CustomEvent<string>;
    blur: CustomEvent<FocusEvent>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type AutocompleteProps = typeof __propDef.props;
export declare type AutocompleteEvents = typeof __propDef.events;
export declare type AutocompleteSlots = typeof __propDef.slots;
export default class Autocomplete extends SvelteComponentTyped<
  AutocompleteProps,
  AutocompleteEvents,
  AutocompleteSlots
> {}
export {};
