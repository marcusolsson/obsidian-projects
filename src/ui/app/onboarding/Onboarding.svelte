<script lang="ts">
  import { Button, ModalButtonGroup, Typography } from "obsidian-svelte";

  import TabContainer from "./TabContainer.svelte";

  export let onCreate: () => void;
  export let onTry: () => void;
</script>

<div class="center">
  <Typography variant="h1">Get started with Projects</Typography>
  <Typography variant="body">
    Projects lets you manage groups of related notes using
    <a href="https://help.obsidian.md/Editing+and+formatting/Properties">
      front matter</a
    >. For example, a folder with the blog posts you're working on.
  </Typography>

  <pre><code
      >---
status: Backlog
due: 2023-01-01
published: false
---

# My blog post</code
    ></pre>

  <Typography variant="body">
    Start from scratch, or explore a demo project 👇
  </Typography>

  <ModalButtonGroup>
    <Button variant="primary" on:click={() => onCreate()}>
      Create new project
    </Button>
    <Button
      variant="default"
      tooltip="Creates a new folder at the root of your vault with example notes."
      on:click={() => onTry()}
    >
      Try a demo project
    </Button>
  </ModalButtonGroup>
  <p
    style={"color: var(--text-muted); margin-top: 45px; font-size: var(--font-ui-smaller);"}
  >
    <strong>Psst! 👋</strong> Next time you can create your projects using any of
    the following ways:
  </p>
  <TabContainer
    options={["Projects view", "Command palette", "File explorer"]}
    let:selected
  >
    {#if selected === "File explorer"}
      <ol>
        <li>
          Right-click a folder in <strong>File explorer</strong>.
        </li>
        <li>Click <strong>Create project in folder</strong>.</li>
      </ol>
    {:else if selected === "Command palette"}
      <ol>
        <li>Open the <strong>Command palette</strong>.</li>
        <li>Search for <strong>Create new project</strong></li>
        <li>Press <strong>Enter</strong>.</li>
      </ol>
    {:else}
      <ol>
        <li>
          In the top-right corner of the <strong>Projects</strong>
          view, click
          <strong>New</strong>.
        </li>
        <li>Click <strong>New project</strong>.</li>
      </ol>
    {/if}
  </TabContainer>
</div>

<style>
  pre {
    background-color: var(--background-primary-alt);
    border-radius: var(--radius-s);
    padding: 8px;
  }
  ol {
    margin: 0;
    padding: 0 22px;
  }
</style>
