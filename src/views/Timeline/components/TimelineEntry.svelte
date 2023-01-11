<script lang="ts">
  import { Checkbox } from "obsidian-svelte";

  import interact from "interactjs";
  import dayjs from "dayjs";

  import type { DataRecord } from "src/lib/data";
  import type { DataField } from "src/lib/data";

  import { getTranslateXY } from "../timeline";
	

  export let checked: boolean | null | undefined = undefined;

  export let startDateField: DataField | undefined;
  export let endDateField: DataField | undefined;

  export let parentwidth: number;

  export let record: DataRecord;
	export let color: string | null = null;

  export let interval: string;
  export let dates: dayjs.Dayjs[];
  export let dateInterval: [dayjs.Dayjs, dayjs.Dayjs];
  export let onRecordUpdate: (record: DataRecord) => void;

  export let onEntryClick: (recordId: string) => void;

  let hover: boolean = false;

  function action(target: HTMLElement) {
    let parentparent = target.parentElement?.parentElement?.children[1];
    let unit = (parentparent?.clientWidth || 1) / dates.length;
    let startday = dayjs(
      record.values[(startDateField as DataField).name] as Date
    );
    let endday = dayjs(record.values[(endDateField as DataField).name] as Date);
    let width =
      (endday.diff(startday, interval == "day" ? "hour" : "days") + 1) * unit;
    let baseX = startday.diff(
      dateInterval[0],
      interval == "day" ? "hour" : "days"
    );

    const modifiers = [
      interact.modifiers.restrictRect({
        restriction: "parent",
      }),
    ];
    interact(target)
      .resizable({
        edges: {
          left: true,
          right: true,
          top: false,
          bottom: false,
        },
        modifiers: [
          interact.modifiers.snapSize({
            targets: [interact.snappers.grid({ width: unit, height: 50 })],
          }),
        ],
        listeners: {
          move: function (event) {
            event.stopPropagation();
            let { translateX, translateY } = getTranslateXY(event.target);

            translateX = (translateX || 0) + event.deltaRect.left;
            let amountMoved = 0;
            let fieldToChange = event.edges.left
              ? startDateField
              : endDateField;
            if (event.edges.left) {
              amountMoved = Math.round(event.deltaRect.left / unit);
            } else if (event.edges.right) {
              amountMoved = Math.round(event.deltaRect.right / unit);
            }
            let isNeg = amountMoved && amountMoved < 0;
            onRecordUpdate({
              id: record.id,
              values: {
                ...record.values,
                [fieldToChange!.name]: dayjs(
                  record.values[fieldToChange!.name] as Date
                )
                  [isNeg ? "subtract" : "add"](
                    Math.abs(amountMoved),
                    interval == "day" ? "hour" : "day"
                  )
                  .toDate(),
              },
            });
            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${translateX}px, ${translateY}px)`,
            });
          },
        },
      })
      .draggable({
        listeners: {
          move(event) {
            event.stopImmediatePropagation();

            let { translateX, translateY } = getTranslateXY(event.target);
            translateX += event.dx;
            translateY += event.dy;
            event.target.style.transform = `translate(${translateX}px, ${translateY}px)`;

            const rvalues = { ...record.values };
            let amountMoved = Math.round(event.dx / unit);
            let isNeg = amountMoved < 0;
            onRecordUpdate({
              id: record.id,
              values: {
                ...rvalues,
                [startDateField!.name]: dayjs(
                  record.values[startDateField!.name] as Date
                )
                  [isNeg ? "subtract" : "add"](
                    Math.abs(amountMoved),
                    interval == "day" ? "hour" : "day"
                  )
                  .toDate(),
                [endDateField!.name]: dayjs(
                  record.values[endDateField!.name] as Date
                )
                  [isNeg ? "subtract" : "add"](
                    Math.abs(amountMoved),
                    interval == "day" ? "hour" : "day"
                  )
                  .toDate(),
              },
            });
          },
        },
        modifiers: [
          interact.modifiers.snapSize({
            targets: [interact.snappers.grid({ width: unit, height: 50 })],
          }),
          ...modifiers,
        ],
      });
    target.setAttribute("data-basex", baseX.toPrecision(21));
    target.setAttribute("data-width", width.toPrecision(21));
    target.style.width = `${width}px`;
    target.style.transform = `translate(${baseX * unit}px, 0px)`;
    return {
      destroy() {},
    };
  }
  export let changed = 0;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key changed}
  <div
    use:action
    class="entry"
    on:click={() => onEntryClick(record.id)}
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
  >
    <!-- If undefined, no field has been set. -->
    <!-- If null, field has been set, but note doesn't have the property. -->
    <div class="entry-container" style={`background-color: ${color||"#0f0f10"}6b !important`}>
      {#if checked !== undefined && checked !== null}
        <Checkbox bind:checked on:check />
      {:else if checked === null && hover}
        <Checkbox checked={false} on:check />
      {/if}
      <span>
        <slot />
      </span>
    </div>
  </div>
{/key}

<style>
  .entry {
    height: 50px;
    color: #fff;
  }
  .entry-container {
    padding: 1em;
    border-radius: 7px;
    background-color: #0f0f106b;
    position: relative;
    width: inherit;
    height: auto;
  }
	
</style>
