export function useClickOutside(element, { onClickOutside, anchorEl, open }) {
    function onClick(event) {
        if (open &&
            !anchorEl.contains(event.target) &&
            !element.contains(event.target)) {
            onClickOutside();
        }
    }
    element.doc.body.addEventListener("click", onClick);
    return {
        update(props) {
            onClickOutside = props.onClickOutside;
        },
        destroy() {
            element.doc.body.removeEventListener("click", onClick);
        },
    };
}
