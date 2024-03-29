import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the icon identifier. Visit https://lucide.dev for all valid
     * identifiers.
     */ icon: string;
    /**
     * Specifies the width and height of the icon in pixels. Defaults to 16px.
     */ size?: "xs" | "sm" | "md" | "lg" | undefined;
    /**
     * Specifies whether icon is active.
     */ active?: boolean | undefined;
    /**
     * Specifies the tooltip.
     */ tooltip?: string | undefined;
    /**
     * Specifies whether to remove the default padding.
     */ nopadding?: boolean | undefined;
    /**
     * Specifies whether the button is disabled.
     */ disabled?: boolean | undefined;
    /**
     * Specifies a callback for when the button is clicked.
     */ onClick?: ((event: MouseEvent) => void) | undefined;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type IconButtonProps = typeof __propDef.props;
export declare type IconButtonEvents = typeof __propDef.events;
export declare type IconButtonSlots = typeof __propDef.slots;
export default class IconButton extends SvelteComponentTyped<
  IconButtonProps,
  IconButtonEvents,
  IconButtonSlots
> {}
export {};
