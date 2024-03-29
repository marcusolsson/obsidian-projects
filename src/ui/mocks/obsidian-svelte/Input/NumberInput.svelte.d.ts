import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the input value.
     */ value: number | null;
    /**
     * Specifies the reference for the underlying input element.
     */ ref?: HTMLInputElement | null | undefined;
    /**
     * Specifies whether the input is readonly.
     */ readonly?: boolean | undefined;
    /**
     * Specifies the placeholder text.
     */ placeholder?: string | undefined;
    /**
     * Specifies whether to focus the input when it's mounted.
     */ autoFocus?: boolean | undefined;
    /**
     * Specifies the width of the input.
     */ width?: string | undefined;
    /**
     * Specifies whether the input contains an error.
     */ error?: boolean | undefined;
    /**
     * Specifies whether to remove styles to embed the input in another
     * component.
     */ embed?: boolean | undefined;
    /**
     * Specifies whether to remove the default padding.
     */ noPadding?: boolean | undefined;
    /**
     * Specifies an helper message for the input.
     */ helperText?: string | undefined;
  };
  events: {
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
    input: CustomEvent<number | null>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type NumberInputProps = typeof __propDef.props;
export declare type NumberInputEvents = typeof __propDef.events;
export declare type NumberInputSlots = typeof __propDef.slots;
export default class NumberInput extends SvelteComponentTyped<
  NumberInputProps,
  NumberInputEvents,
  NumberInputSlots
> {}
export {};
