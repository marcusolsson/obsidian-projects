import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the type of input.
     */ type: "text" | "number";
    /**
     * Specifies the input value.
     */ value: any;
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
     * Specifies an message for the input.
     */ helperText?: string | undefined;
  };
  events: {
    input: CustomEvent<any>;
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type InputProps = typeof __propDef.props;
export declare type InputEvents = typeof __propDef.events;
export declare type InputSlots = typeof __propDef.slots;
export default class Input extends SvelteComponentTyped<
  InputProps,
  InputEvents,
  InputSlots
> {}
export {};
