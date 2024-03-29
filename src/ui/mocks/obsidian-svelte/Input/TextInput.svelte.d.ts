import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the input value.
     */ value: string;
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
     * Specifies an helper message for the input.
     */ helperText?: string | undefined;
    /**
     * Specifies whether to remove styles to embed the input in another
     * component.
     */ embed?: boolean | undefined;
    /**
     * Specifies whether to remove the default padding.
     */ noPadding?: boolean | undefined;
    /**
     * Specifies the reference for the underlying input element.
     */ ref?: HTMLInputElement | null | undefined;
  };
  events: {
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    input: CustomEvent<string>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type TextInputProps = typeof __propDef.props;
export declare type TextInputEvents = typeof __propDef.events;
export declare type TextInputSlots = typeof __propDef.slots;
export default class TextInput extends SvelteComponentTyped<
  TextInputProps,
  TextInputEvents,
  TextInputSlots
> {}
export {};
