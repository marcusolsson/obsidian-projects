export function useClickOutside(element, { onClickOutside, anchorEl, open }) {
    function onClick(event) {
        if (open &&
            !anchorEl.contains(event.target) &&
            !element.contains(event.target)) {
            onClickOutside();
        }
    }
    element.ownerDocument.body.addEventListener("click", onClick);
    return {
        update(props) {
            onClickOutside = props.onClickOutside;
        },
        destroy() {
            element.ownerDocument.body.removeEventListener("click", onClick);
        },
    };
}
