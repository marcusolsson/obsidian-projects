<script lang="ts">
	import { Setting } from "obsidian";

	export let name: string;
	export let onClick: (event: MouseEvent) => void;
	export let cta: boolean = false;
	export let disabled: boolean = false;

	function createSetting(node: HTMLElement, disabled: boolean) {
		new Setting(node).addButton((button) => {
			button.setButtonText(name).setDisabled(disabled).onClick(onClick);

			if (cta) {
				button.setCta();
			}
		});
	}

	function setting(node: HTMLElement, disabled: boolean) {
		createSetting(node, disabled);

		return {
			update(disabled: boolean) {
				node.empty();

				createSetting(node, disabled);
			},
		};
	}
</script>

<div use:setting={disabled} />
