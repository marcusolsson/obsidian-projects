import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";
import type { DataField, DataFrame } from "../dataframe/dataframe";
import type { IFile } from "../filesystem/filesystem";

/**
 * DataSource reads data frames from a project.
 */
export abstract class DataSource {
  constructor(
    readonly project: ProjectDefinition,
    readonly preferences: ProjectsPluginPreferences
  ) {}

  /**
   * queryAll returns a DataFrame with all records in the project.
   */
  abstract queryAll(): Promise<DataFrame>;

  /**
   * queryOne returns a DataFrame with a single record for the given file.
   *
   * @param fields contains existing fields, to be able to parse file into the existing schema.
   */
  abstract queryOne(file: IFile, fields: DataField[]): Promise<DataFrame>;

  /**
   * includes returns whether a path belongs to the current project.
   */
  abstract includes(path: string): boolean;

  /**
   * readonly returns whether the data source is read-only.
   *
   * Read-only data sources are typically derived records where the data
   * source can't determine the original names of the fields.
   */
  readonly(): boolean {
    return false;
  }
}
