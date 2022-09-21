<script lang="ts">
	import {
		type Instance,
		createPopper,
		type OptionsGeneric,
		type Modifier,
	} from "@popperjs/core";
	import { onDestroy } from "svelte";
	import Portal from "svelte-portal";
	import { useClickOutside } from "./useClickOutside";

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

	onDestroy(() => {
		if (popper) {
			popper.destroy();
		}
	});
</script>

{#if open}
	<Portal target={document.body}>
		<div
			bind:this={ref}
			class="menu"
			use:useClickOutside={{
				open,
				anchorEl,
				onClickOutside: () => onClose(),
			}}
		>
			<slot />
		</div>
	</Portal>
{/if}
