<script lang="ts">
	import dayjs from "dayjs";
  import {
    SettingItem,
    ModalLayout,
    ModalContent,
    Select,
  } from "obsidian-svelte";
	import { i18n } from "src/lib/stores/i18n";
  import type { CalendarWeekStart } from "../calendar";
  import type { CalendarConfig } from "../types";

  export let config: CalendarConfig;
  export let onSave: (config: CalendarConfig) => void;


	$: weekStart = config?.weekStart ?? "monday";
  $: dayjs.updateLocale(dayjs.locale(), {
    weekStart: weekStart == "sunday" ? 1 : 0,
  });

	function handleWeekStartChange(startOn: string) {
    if (
      startOn.toLocaleLowerCase() == "monday" ||
      startOn.toLocaleLowerCase() == "sunday"
    ) {
      onSave({ ...config, weekStart: startOn as CalendarWeekStart });
    }
  }
</script>
<ModalLayout title="Calendar settings">
	<ModalContent>
		<SettingItem name="First day of week" description="Whether to start calendar weeks on Sunday or Monday">
			<Select
          value={config?.weekStart ?? "sunday"}
          options={[
            {
              label: $i18n.t("views.calendar.startOfWeek.sunday"),
              value: "sunday",
            },
            {
              label: $i18n.t("views.calendar.startOfWeek.monday"),
              value: "monday",
            },
          ]}
          on:change={({ detail }) => handleWeekStartChange(detail)}
        />
		</SettingItem>
	</ModalContent>
</ModalLayout>