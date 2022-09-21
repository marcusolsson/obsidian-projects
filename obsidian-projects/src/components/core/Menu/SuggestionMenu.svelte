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
	export let params: Partial<OptionsGeneric<Partial<Modifier<any, any>>>> = {
		placement: "bottom-start",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 4],
				},
			},
		],
	};

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
			class="suggestion-container"
			use:useClickOutside={{
				open,
				anchorEl,
				onClickOutside: () => onClose(),
			}}
		>
			<div class="suggestion" style="max-height: 300px;">
				<slot />
			</div>
		</div>
	</Portal>
{/if}
