<script lang="ts">
  import { onMount } from "svelte";
  import { Checkbox } from "obsidian-svelte";

  import interact from "interactjs";
  import dayjs from "dayjs";

  import type { DataRecord } from "src/lib/data";
  import type { DataField } from "src/lib/data";

  export let checked: boolean | null | undefined = undefined;

  export let startDateField: DataField | undefined;
  export let endDateField: DataField | undefined;

  export let parentwidth: number;

  export let record: DataRecord;

  export let interval: string;
  export let dates: dayjs.Dayjs[];
  export let dateInterval: [dayjs.Dayjs, dayjs.Dayjs]
  export let onRecordUpdate: (record: DataRecord) => void;

  export let onEntryClick: (recordId: string) => void;

  let hover: boolean = false;

  // let target: HTMLElement;
  let position = { x: 0, y: 0 };
  function action(target: HTMLElement) {
    let unit = (parentwidth || 1) / dates.length;
    let startday = dayjs(record.values[(startDateField as DataField).name] as Date)
    let endday = dayjs(record.values[(endDateField as DataField).name] as Date)
    let width = (endday.diff((startday), interval == "day" ? "hour" : "days") + 1) * (unit)
    let baseX = startday.diff(dateInterval[0], interval == "day" ? "hour" : "days")
    console.log(startday.toDate(), endday.toDate())
    console.log("basex, width", baseX * unit, width, parentwidth)
    // 
    
    const modifiers = [
      interact.modifiers.restrictRect({
        restriction: "parent",
        // endOnly: true,
      }),
    ];
    console.log("unit=", unit)
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
            targets: [
              // { width: 100 },
              interact.snappers.grid({ width: unit, height: 50 }),
            ],
          }),
          // interact.modifiers.restrictSize({ max: 'parent' }),
        ],
        listeners: {
          move: function (event) {
            console.log(event)
            console.log(event.rect);
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
          },
        },
      })
      .draggable({
        listeners: {
          start(event) {},
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
        modifiers: [
          interact.modifiers.snapSize({
            targets: [
              // { width: 100 },
              interact.snappers.grid({ width: unit, height: 50 }),
            ],
          }),
          ...modifiers
        ],
      });
      target.setAttribute("data-basex", baseX)
    target.setAttribute("data-width", width)
    target.style.width = `${width}px`
    target.style.transform = `translate(${baseX * unit}px, 0px)`
    return {
      destroy() {
        console.log("destruction", target)
				// document.getElementById("interacter")?.replaceChildren()
        
      }
    }
  }
  onMount(() => {
				// document.getElementById("interacter")?.replaceChildren()
    // console.log("mountie")
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key record}
  <div use:action
    class="entryy"
    on:click={() => {onEntryClick(record.id)}}
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
    >
    <!-- If undefined, no field has been set. -->
    <!-- If null, field has been set, but note doesn't have the property. -->
    {#if checked !== undefined && checked !== null}
      <Checkbox bind:checked on:check />
    {:else if checked === null && hover}
      <Checkbox checked={false} on:check />
    {/if}
    <span>
      <slot />
    </span>
  </div>
{/key}

<style>
  .entryy {
    height: 50px;

    background-color: #19242f;
    padding: 1em;
    /* position: absolute; */
    color: var(--interactive-accent);
    /* background: transparent; */
  }
</style>
