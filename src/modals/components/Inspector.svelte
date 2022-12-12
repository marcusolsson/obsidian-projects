<script lang="ts">
  import {
    Button,
    IconButton,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
  } from "obsidian-svelte";
  import Flair from "src/app/toolbar/Flair.svelte";
  import Accordion from "src/components/Accordion/Accordion.svelte";
  import AccordionItem from "src/components/Accordion/AccordionItem.svelte";
  import type { RecordError } from "src/lib/datasources/frontmatter/frontmatter";

  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { getDisplayName } from "src/views/Board/components/Board/board-helpers";

  export let title: string;
  export let errors: RecordError[];
  export let onCancel: () => void;

  function getFolder(recordId: string) {
    const idx = recordId.lastIndexOf("/");

    if (idx < 0) {
      return "/";
    }

    return recordId.slice(0, idx);
  }
</script>

<ModalLayout {title}>
  <ModalContent>
    <p>
      Issues marked as errors don't show up in your views. Fix the reported
      issue to include them.
    </p>
    <Accordion>
      {#each errors as error}
        <AccordionItem>
          <div slot="header">
            <span
              ><Flair>error</Flair><IconButton
                icon="search"
                on:click={(event) => {
                  $app.workspace.openLinkText(error.recordId, "", true);
                  event.stopPropagation();
                  onCancel();
                }}
              />
              <div class="setting-item-info">
                <div class="setting-item-name">
                  {getDisplayName(error.recordId)}
                </div>
                <div class="setting-item-description">
                  {getFolder(error.recordId)}
                </div>
              </div>
            </span>
          </div>
          <pre>{error.err}</pre>
        </AccordionItem>
      {/each}
    </Accordion>
  </ModalContent>
  <ModalButtonGroup>
    <Button
      on:click={() => {
        onCancel();
      }}>{$i18n.t("modals.input.cancel")}</Button
    >
  </ModalButtonGroup>
</ModalLayout>

<style>
  pre {
    overflow: scroll;
  }
  span {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
