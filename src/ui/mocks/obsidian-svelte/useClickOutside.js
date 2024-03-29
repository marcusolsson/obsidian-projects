export function useClickOutside(element, callbackFunction) {
    function onClick(event) {
        if (!element.contains(event.target)) {
            callbackFunction();
        }
    }
    element.ownerDocument.body.addEventListener("click", onClick);
    return {
        update(newCallbackFunction) {
            callbackFunction = newCallbackFunction;
        },
        destroy() {
            element.ownerDocument.body.removeEventListener("click", onClick);
        },
    };
}
