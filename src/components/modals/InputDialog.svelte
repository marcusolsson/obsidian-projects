<script lang="ts">
	import { i18n } from "src/lib/stores/i18n";
	import Button from "../core/Button/Button.svelte";

	export let value: string;
	export let message: string;
	export let cta: string;
	export let onSubmit: (value: string) => void;
	export let onCancel: () => void;

	let ref: HTMLInputElement;
</script>

<div class="modal-title">{message}</div>

<div class="modal-content">
	<input
		bind:this={ref}
		type="text"
		bind:value
		on:focus={() => ref.select()}
	/>
</div>

<div class="modal-button-container">
	<Button
		variant="primary"
		on:click={() => {
			onSubmit(value);
		}}>{cta}</Button
	>
	<Button
		on:click={() => {
			onCancel();
		}}>{$i18n.t("modals.input.cancel")}</Button
	>
</div>

<style>
	input {
		width: 100%;
	}
</style>
