import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the suggestion label.
     */ label: string;
    /**
     * Specifies the suggestion description.
     */ description?: string | undefined;
    /**
     * Specifies whether the suggestion is selected.
     */ selected?: boolean | undefined;
  };
  events: {
    click: CustomEvent<void>;
    select: CustomEvent<boolean>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type SuggestionItemProps = typeof __propDef.props;
export declare type SuggestionItemEvents = typeof __propDef.events;
export declare type SuggestionItemSlots = typeof __propDef.slots;
export default class SuggestionItem extends SvelteComponentTyped<
  SuggestionItemProps,
  SuggestionItemEvents,
  SuggestionItemSlots
> {}
export {};
