interface ClickOutsideProps {
  onClickOutside: () => void;
  anchorEl: HTMLElement;
  open: boolean;
}
export declare function useClickOutside(
  element: HTMLElement,
  { onClickOutside, anchorEl, open }: ClickOutsideProps
): {
  update(props: ClickOutsideProps): void;
  destroy(): void;
};
export {};
