import { get } from "svelte/store";

import type {
  DataQueryResult,
  ProjectView,
  ProjectViewProps,
} from "src/customViewApi";
import type { DataRecord } from "src/lib/dataframe/dataframe";
import { customViews } from "src/lib/stores/customViews";
import type { ViewApi } from "src/lib/viewApi";
import type { ProjectDefinition, ViewDefinition } from "src/settings/settings";

export interface ViewProps {
  view: ViewDefinition;
  dataProps: DataQueryResult;
  config: Record<string, any>;
  onConfigChange: (config: Record<string, any>) => void;
  viewApi: ViewApi;
  readonly: boolean;
  project: ProjectDefinition;
  getRecordColor: (record: DataRecord) => string | null;
  sortRecords: ProjectViewProps["sortRecords"];
  getRecord: ProjectViewProps["getRecord"];
}

export function useView(node: HTMLElement, props: ViewProps) {
  // Keep track of previous view id to determine if view should be invalidated.
  let viewId: string;
  const projectId = props.project.id;
  let projectView: ProjectView<Record<string, any>> | undefined;

  const update = (newprops: ViewProps) => {
    // User switched to a different view.
    const dirty =
      newprops.view.id !== viewId || newprops.project.id !== projectId;

    if (dirty) {
      // Clean up previous view.
      projectView?.onClose();

      node.empty();

      // Look up the next view.
      projectView = get(customViews)[newprops.view.type];

      if (projectView) {
        projectView.onOpen({
          contentEl: node,
          viewId: newprops.view.id,
          project: newprops.project,
          viewApi: newprops.viewApi,
          readonly: newprops.readonly,
          config: newprops.config,
          saveConfig: newprops.onConfigChange,
          getRecordColor: newprops.getRecordColor,
          sortRecords: newprops.sortRecords,
          getRecord: newprops.getRecord,
        });
        projectView.onData(newprops.dataProps);
      }

      viewId = newprops.view.id;
    } else {
      projectView?.onData(newprops.dataProps);
    }
  };

  update(props);

  return {
    update,
    destroy() {
      projectView?.onClose();
    },
  };
}
