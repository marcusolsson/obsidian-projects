export function useClickOutside(element, { onClickOutside, anchorEl, open }) {
    function onClick(event) {
        if (open &&
            !anchorEl.contains(event.target) &&
            !element.contains(event.target)) {
            onClickOutside();
        }
    }
    document.body.addEventListener("click", onClick);
    return {
        update(props) {
            onClickOutside = props.onClickOutside;
        },
        destroy() {
            document.body.removeEventListener("click", onClick);
        },
    };
}
