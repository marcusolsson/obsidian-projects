<script lang="ts">
	import { MarkdownRenderer } from "obsidian";
	import { view } from "../../lib/stores";

	export let value: string;

	function markdown(node: HTMLElement) {
		MarkdownRenderer.renderMarkdown(value, node, "Untitled.md", $view);
	}
</script>

<div use:markdown />

<style>
	div {
		padding: 6px;
		width: 100%;
	}

	:global(*:first-child) {
		margin-top: 0;
	}

	:global(*:last-child) {
		margin-bottom: 0;
	}
</style>
