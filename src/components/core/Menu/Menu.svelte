<script lang="ts">
	import {
		type Instance,
		createPopper,
		type OptionsGeneric,
		type Modifier,
	} from "@popperjs/core";
	import { onDestroy } from "svelte";

	export let anchorEl: HTMLElement;
	export let open: boolean;
	export let onClose: () => void;
	export let params: Partial<OptionsGeneric<Partial<Modifier<any, any>>>> =
		{};

	let ref: HTMLElement;
	let popper: Instance | null = null;

	$: {
		if (anchorEl && ref) {
			popper = createPopper(anchorEl, ref, params);
		}
	}

	function clickOutside(element: HTMLElement, callbackFunction: () => void) {
		function onClick(event: any) {
			if (
				open &&
				!anchorEl.contains(event.target) &&
				!element.contains(event.target)
			) {
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

	onDestroy(() => {
		if (popper) {
			popper.destroy();
		}
	});
</script>

{#if open}
	<div bind:this={ref} class="menu" use:clickOutside={() => onClose()}>
		<slot />
	</div>
{/if}
