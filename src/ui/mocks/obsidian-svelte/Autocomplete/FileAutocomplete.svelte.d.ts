import { SvelteComponentTyped } from "svelte";
import type { TAbstractFile } from "obsidian";
declare const __propDef: {
  props: {
    /**
     * Specify the text input value.
     */ value: string;
    /**
     * Specify the files to select from.
     */ files: TAbstractFile[];
    /**
     * Specify a function to format the label.
     */ getLabel?: ((file: TAbstractFile) => string) | undefined;
    /**
     * Specify a function to format the description.
     */ getDescription?: ((file: TAbstractFile) => string) | undefined;
    /**
     * Input props.
     */ embed?: boolean | undefined;
    readonly?: boolean | undefined;
    placeholder?: string | undefined;
    width?: string | undefined;
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
export declare type FileAutocompleteProps = typeof __propDef.props;
export declare type FileAutocompleteEvents = typeof __propDef.events;
export declare type FileAutocompleteSlots = typeof __propDef.slots;
export default class FileAutocomplete extends SvelteComponentTyped<
  FileAutocompleteProps,
  FileAutocompleteEvents,
  FileAutocompleteSlots
> {}
export {};
