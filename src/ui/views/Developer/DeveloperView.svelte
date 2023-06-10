<script lang="ts">
  import { Notice, TFile } from "obsidian";
  import {
    Autocomplete,
    Button,
    Callout,
    Card,
    Checkbox,
    ColorInput,
    DateInput,
    FileAutocomplete,
    Icon,
    IconButton,
    InternalLink,
    Link,
    Loading,
    Menu,
    MenuItem,
    NumberInput,
    Popover,
    Select,
    SettingItem,
    Slider,
    Suggestion,
    SuggestionItem,
    Switch,
    Tag,
    TextInput,
    Typography,
  } from "obsidian-svelte";

  import { HorizontalGroup } from "src/ui/components/HorizontalGroup";
  import { ViewContent, ViewLayout } from "src/ui/components/Layout";
  import { getNotesInFolder } from "src/lib/obsidian";
  import { app } from "src/lib/stores/obsidian";

  let btn1: HTMLButtonElement;
  let btn1Open = false;

  let btn2: HTMLButtonElement;
  let btn2Open = false;

  let btn3: HTMLButtonElement;
  let btn3Open = false;

  let textValue = "Text";
  let numberValue = 10;
</script>

<ViewLayout>
  <ViewContent>
    <Typography variant="h2">Inputs</Typography>

    <Card>
      <Typography variant="h3">Buttons</Typography>

      <div>
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="plain">Plain</Button>
      </div>
    </Card>

    <Card>
      <Typography variant="h3">Toggles</Typography>

      <SettingItem name="Switch">
        <Switch checked={false} />
      </SettingItem>
      <SettingItem name="Checkbox">
        <Checkbox checked={false} />
      </SettingItem>
    </Card>

    <Card>
      <Typography variant="h3">Input</Typography>

      <SettingItem name="TextInput">
        <TextInput bind:value={textValue} helperText={textValue} />
      </SettingItem>
      <SettingItem name="NumberInput">
        <NumberInput bind:value={numberValue} helperText={textValue} error />
      </SettingItem>
      <SettingItem name="DateInput">
        <DateInput value={new Date()} />
      </SettingItem>
      <SettingItem name="Select">
        <Select
          value="bar"
          options={[
            { label: "Foo", value: "foo" },
            { label: "Bar", value: "bar" },
            { label: "Baz", value: "baz" },
          ]}
        />
      </SettingItem>
    </Card>

    <Card>
      <SettingItem name="Color">
        <ColorInput value="#ff0000" />
      </SettingItem>
      <SettingItem name="Slider">
        <Slider value={3} min={1} max={30} step={1} />
      </SettingItem>
    </Card>

    <Card>
      <Typography variant="h3">Autocomplete</Typography>

      <SettingItem name="Autocomplete">
        <Autocomplete
          value=""
          options={[{ label: "Foo", description: "Description" }]}
          on:change={({ detail }) =>
            new Notice(`Autocomplete changed: ${detail}`)}
        />
      </SettingItem>
      <SettingItem name="FileAutocomplete">
        <FileAutocomplete
          value=""
          files={getNotesInFolder($app.vault.getRoot())}
          getLabel={(file) =>
            file instanceof TFile ? file.basename : file.name}
          getDescription={(file) => file.path.split("/").slice(0, -1).join("/")}
          on:change={({ detail }) =>
            new Notice(`FileAutocomplete changed: ${detail}`)}
        />
      </SettingItem>
    </Card>

    <Typography variant="h2">Data display</Typography>

    <Card>
      <SettingItem name="Tag">
        <Tag>#tag</Tag>
      </SettingItem>
    </Card>

    <Card>
      <Typography variant="h3">Popover</Typography>

      <HorizontalGroup>
        <button bind:this={btn1} on:click={() => (btn1Open = !btn1Open)}>
          Popover
        </button>
        <Popover
          anchorEl={btn1}
          open={btn1Open}
          placement="auto"
          onClose={() => {}}
        >
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

    <Card>
      <Typography variant="h3">Icons</Typography>
      <HorizontalGroup>
        <Icon name="heart" size="xs" />
        <Icon name="heart" size="sm" />
        <Icon name="heart" size="md" />
        <Icon name="heart" size="lg" />
      </HorizontalGroup>
      <HorizontalGroup>
        <IconButton icon="heart" size={"xs"} />
        <IconButton icon="heart" size={"sm"} />
        <IconButton icon="heart" size={"md"} active />
        <IconButton icon="heart" size={"lg"} />
      </HorizontalGroup>
    </Card>

    <Card>
      <Typography variant="h3">Links</Typography>

      <ul>
        <li><Link href="image.png">Image</Link></li>
        <li><Link href="https://google.com">Google</Link></li>
        <li>
          <InternalLink
            linkText="Untitled 1"
            sourcePath="Untitled.md"
            on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
              $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
            }}
            resolved={true}>Resolved internal link</InternalLink
          >
        </li>
        <li>
          <InternalLink
            linkText="Untitled 1"
            sourcePath="Untitled.md"
            on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
              $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
            }}
            resolved={false}>Unresolved internal link</InternalLink
          >
        </li>
      </ul>
    </Card>

    <Typography variant="h2">Feedback</Typography>

    <Card>
      <Typography variant="h3">Loading</Typography>

      <Loading />
    </Card>

    <Card>
      <Typography variant="h3">Callout</Typography>

      <Callout title="Info" icon="star" variant="info">Lorem ipsum</Callout>
      <Callout title="Danger" icon="alert-circle" variant="danger"
        >Lorem ipsum</Callout
      >
    </Card>
  </ViewContent>
</ViewLayout>

<style>
  button {
    display: inline;
    width: auto;
  }
</style>
