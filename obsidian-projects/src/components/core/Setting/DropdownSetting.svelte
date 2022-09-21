<script lang="ts">
	import { Setting } from "obsidian";

	export let name: string;
	export let value: string;
	export let onChange: (value: string) => void;
	export let options: Record<string, string>;

	function setting(node: HTMLElement) {
		new Setting(node).setName(name).addDropdown((dropdown) => {
			dropdown.addOptions(options);
			dropdown.setValue(value);
			dropdown.onChange(onChange);
		});
	}
</script>

<div use:setting />
