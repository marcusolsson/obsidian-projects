<script lang="ts">
	import { Setting } from "obsidian";

	export let name: string;
	export let value: string;
	export let description: string = "";
	export let onChange: (text: string) => void;
	export let placeholder: string = "";

	function setting(node: HTMLElement) {
		new Setting(node)
			.setName(name)
			.setDesc(description)
			.addText((text) => {
				text.onChange(onChange);
				text.setValue(value);

				if (placeholder) {
					text.setPlaceholder(placeholder);
				}
			});
	}
</script>

<div use:setting />
