import { type Instance, createPopper } from "@popperjs/core";
import type { SvelteComponent, SvelteComponentTyped } from "svelte";
import type { Newable } from "ts-essentials";

interface PopoverProps<T extends SvelteComponentTyped> {
	component: Newable<T>;
	[key: string]: any;
}

// From https://dev.to/gokayokyay/how-to-use-popper-with-svelte-in-a-sveltish-way-with-actions-2h02
export function popover<T extends SvelteComponentTyped>(
	node: HTMLElement,
	{ component, ...props }: PopoverProps<T>
) {
	let popperInstance: Instance | null;
	let componentInstance: SvelteComponent;
	let isActive = false;
	let renderedComponent: HTMLElement | null;
	const id = "obsidian-projects--menu";

	const toggle = (event: MouseEvent) => {
		event.stopPropagation();
		isActive ? hide() : show();
	};

	node.addEventListener("click", toggle);

	const detectClickOutside = (event: MouseEvent) => {
		if (
			renderedComponent &&
			!renderedComponent.contains(event.target as Node | null) &&
			isActive
		) {
			hide();
		}
	};

	const show = () => {
		componentInstance = new component({
			target: document.body,
			props,
		});
		isActive = true;
		renderedComponent = document.querySelector(`#${id}`);

		if (renderedComponent) {
			popperInstance = createPopper(node, renderedComponent, {
				modifiers: [
					{
						name: "offset",
						options: {
							offset: [0, 4],
						},
					},
				],
			});
		}

		document.addEventListener("click", detectClickOutside);
	};

	const hide = () => {
		renderedComponent = document.querySelector(`#${id}`);
		isActive = false;

		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}

		componentInstance.$destroy();
		document.removeEventListener("click", detectClickOutside);
	};

	return {
		destroy() {
			node.removeEventListener("click", toggle);
			document.removeEventListener("click", detectClickOutside);
		},
	};
}
