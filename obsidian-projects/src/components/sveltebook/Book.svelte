<script lang="ts">
	import {
		Typography,
		Button,
		Checkbox,
		Popover,
		Menu,
		MenuItem,
		Suggestion,
		SuggestionItem,
	} from "obsidian-svelte";
	import FileSuggestInput from "../core/SuggestInput/FileSuggestInput.svelte";

	let btn1: HTMLButtonElement;
	let btn1Open = false;

	let btn2: HTMLButtonElement;
	let btn2Open = false;

	let btn3: HTMLButtonElement;
	let btn3Open = false;
</script>

<Typography variant="h2">Buttons</Typography>

<div>
	<Button>Default</Button>
	<Button variant="primary">Primary</Button>
	<Button variant="destructive">Destructive</Button>
	<Button variant="plain">Plain</Button>
</div>

<Typography variant="h2">Checkbox</Typography>

<Checkbox checked={true} />
<Checkbox checked={false} />

<Typography variant="h2">Popover</Typography>

<div>
	<button bind:this={btn1} on:click={() => (btn1Open = !btn1Open)}
		>Popover</button
	>
	<Popover anchorEl={btn1} open={btn1Open} placement="auto">
		<Button variant="primary">Click me</Button>
	</Popover>

	<button bind:this={btn2} on:click={() => (btn2Open = !btn2Open)}
		>Menu</button
	>
	<Menu anchorEl={btn2} open={btn2Open} placement="auto">
		<MenuItem label="Item 1" icon="eye" />
		<MenuItem label="Item 2" icon="eye" checked={true} />
		<MenuItem label="Item 3" checked={false} />
	</Menu>

	<button bind:this={btn3} on:click={() => (btn3Open = !btn3Open)}
		>Suggestions</button
	>
	<Suggestion anchorEl={btn3} open={btn3Open} placement="auto">
		<SuggestionItem
			label="Item 1"
			description="A pretty long description"
			selected
		/>
		<SuggestionItem label="Item 2" description="Short" />
		<SuggestionItem label="Item 3" />
	</Suggestion>
</div>

<Typography variant="h2">Application</Typography>

<div>
	<FileSuggestInput
		value=""
		onChange={() => {}}
		sourcePath=""
		valueType="path"
		include="all"
	/>
	<FileSuggestInput
		value=""
		onChange={() => {}}
		sourcePath=""
		valueType="path"
		include="folders"
	/>
	<FileSuggestInput
		value=""
		onChange={() => {}}
		sourcePath=""
		valueType="path"
		include="files"
	/>
</div>

<style>
	button {
		display: inline;
		width: auto;
	}
</style>
