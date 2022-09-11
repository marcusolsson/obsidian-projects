<script lang="ts">
	import Menu from "./Menu.svelte";
	import { popover } from "./popover";
	interface SwitchItem {
		label: string;
		value: string;
		enabled: boolean;
	}

	export let items: SwitchItem[];
	export let label: string;
	export let onChange: (value: string, enabled: boolean) => void;
</script>

<div
	use:popover={{
		component: Menu,
		items,
		onChange,
	}}
	class="dropdown"
>
	{label}
</div>

<style>
	div {
		align-items: center;
		display: inline-flex;
		text-align: start;
	}
</style>
