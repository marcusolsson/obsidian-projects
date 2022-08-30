<script lang="ts">
	import { Setting } from "obsidian";

	export let name: string;
	export let onClick: (event: MouseEvent) => void;
	export let cta: boolean = false;

	function setting(node: HTMLElement) {
		new Setting(node).addButton((button) => {
			button.onClick(onClick);

			if (cta) {
				button.setCta();
			}

			button.setButtonText(name);
		});
	}
</script>

<div use:setting />
