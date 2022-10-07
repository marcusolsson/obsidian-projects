<script lang="ts">
	import { Notice, TFile } from "obsidian";
	import {
		Typography,
		Button,
		TextInput,
		Switch,
		Popover,
		Menu,
		MenuItem,
		Suggestion,
		SuggestionItem,
		NumberInput,
		Card,
		Loading,
		Checkbox,
		Autocomplete,
	} from "obsidian-svelte";
	import { getNotesInFolder } from "../../app";
	import HorizontalGroup from "../../core/HorizontalGroup/HorizontalGroup.svelte";

	import FileAutocomplete from "../../core/SuggestInput/FileAutocomplete.svelte";
	import { app } from "../../../lib/stores/obsidian";

	let btn1: HTMLButtonElement;
	let btn1Open = false;

	let btn2: HTMLButtonElement;
	let btn2Open = false;

	let btn3: HTMLButtonElement;
	let btn3Open = false;

	let textValue = "Text";
	let numberValue = 10;
</script>

<div class="container">
	<Typography variant="h2">Buttons</Typography>

	<Card>
		<div>
			<Button>Default</Button>
			<Button variant="primary">Primary</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="plain">Plain</Button>
		</div>
	</Card>

	<Typography variant="h2">Switch</Typography>

	<Card>
		<HorizontalGroup>
			<Switch checked={true} />
			<Switch checked={false} />
			<Checkbox checked={true} />
			<Checkbox checked={false} />
		</HorizontalGroup>
	</Card>

	<Typography variant="h2">Popover</Typography>

	<Card>
		<HorizontalGroup>
			<button bind:this={btn1} on:click={() => (btn1Open = !btn1Open)}>
				Popover
			</button>
			<Popover anchorEl={btn1} open={btn1Open} placement="auto">
				<Button variant="primary">Click me</Button>
			</Popover>

			<button bind:this={btn2} on:click={() => (btn2Open = !btn2Open)}>
				Menu
			</button>
			<Menu anchorEl={btn2} open={btn2Open} placement="auto">
				<MenuItem label="Item 1" icon="eye" />
				<MenuItem label="Item 2" icon="eye" checked={true} />
				<MenuItem label="Item 3" checked={false} />
			</Menu>

			<button bind:this={btn3} on:click={() => (btn3Open = !btn3Open)}>
				Suggestions
			</button>
			<Suggestion anchorEl={btn3} open={btn3Open} placement="auto">
				<SuggestionItem
					label="Item 1"
					description="A pretty long description"
					selected
				/>
				<SuggestionItem label="Item 2" description="Short" />
				<SuggestionItem label="Item 3" />
			</Suggestion>
		</HorizontalGroup>
	</Card>

	<Typography variant="h2">Input</Typography>

	<Card>
		<HorizontalGroup>
			<TextInput bind:value={textValue} helperText={textValue} />
			<NumberInput
				bind:value={numberValue}
				helperText={textValue}
				error
			/>
		</HorizontalGroup>
	</Card>

	<Typography variant="h2">Autocomplete</Typography>

	<Card>
		<Typography variant="h3">Plain</Typography>

		<HorizontalGroup>
			<Autocomplete
				value=""
				options={[
					{ id: "foo", label: "Foo", description: "Description" },
				]}
				on:change={({ detail }) =>
					new Notice(`Autocomplete changed: ${detail}`)}
			/>
		</HorizontalGroup>
		<Typography variant="h3">Files and folders</Typography>

		<HorizontalGroup>
			<FileAutocomplete
				value=""
				files={getNotesInFolder($app.vault.getRoot(), false)}
				getOptionLabel={(file) =>
					file instanceof TFile ? file.basename : file.name}
				getOptionDescription={(file) =>
					file.path.split("/").slice(0, -1).join("/")}
				on:change={({ detail }) =>
					new Notice(`FileAutocomplete changed: ${detail}`)}
			/>
		</HorizontalGroup>
	</Card>

	<Typography variant="h2">Loading</Typography>

	<Card>
		<Loading />
	</Card>
</div>

<style>
	button {
		display: inline;
		width: auto;
	}

	.container {
		padding: 10px;
	}
</style>
