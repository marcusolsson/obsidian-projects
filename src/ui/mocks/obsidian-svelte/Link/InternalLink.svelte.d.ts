import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    /**
     * Specifies the link text.
     */ linkText: string;
    /**
     * Specifies the path to the source file.
     */ sourcePath: string;
    /**
     * Specifies a tooltip to display when hovering the link.
     */ tooltip?: string | undefined;
    /**
     * Specifies whether the link is resolved.
     */ resolved: boolean;
  };
  events: {
    open: CustomEvent<{
      linkText: string;
      sourcePath: string;
      newLeaf: boolean;
    }>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type InternalLinkProps = typeof __propDef.props;
export declare type InternalLinkEvents = typeof __propDef.events;
export declare type InternalLinkSlots = typeof __propDef.slots;
export default class InternalLink extends SvelteComponentTyped<
  InternalLinkProps,
  InternalLinkEvents,
  InternalLinkSlots
> {}
export {};
