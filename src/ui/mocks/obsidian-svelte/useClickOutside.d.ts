export declare function useClickOutside(
  element: HTMLElement,
  callbackFunction: () => void
): {
  update(newCallbackFunction: () => void): void;
  destroy(): void;
};
