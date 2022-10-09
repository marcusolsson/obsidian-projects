export function useClickOutside(
	element: HTMLElement,
	callbackFunction: () => void
) {
	function onClick(event: any) {
		if (!element.contains(event.target)) {
			callbackFunction();
		}
	}

	document.body.addEventListener("click", onClick);

	return {
		update(newCallbackFunction: () => void) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener("click", onClick);
		},
	};
}
