<script lang="ts">
  import {
    Button,
    IconButton,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
  } from "obsidian-svelte";
  import { Flair } from "src/ui/components/Flair";
  import { Accordion } from "src/ui/components/Accordion";
  import { AccordionItem } from "src/ui/components/Accordion";
  import type { RecordError } from "src/lib/datasources/frontmatter/datasource";

  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { getDisplayName } from "src/ui/views/Board/components/Board/boardHelpers";

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
              ><Flair variant="error">error</Flair><IconButton
                icon="search"
                onClick={(event) => {
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
