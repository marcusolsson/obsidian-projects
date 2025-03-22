"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SETTINGS = exports.DEFAULT_PROJECT = exports.DEFAULT_VIEW = void 0;
/**
 * Default values
 */
exports.DEFAULT_VIEW = {
    config: {},
    filter: { conjunction: "and", conditions: [] },
    colors: { conditions: [] },
    sort: { criteria: [] },
};
exports.DEFAULT_PROJECT = {
    fieldConfig: {},
    defaultName: "",
    templates: [],
    excludedFiles: [],
    isDefault: false,
    dataSource: {
        kind: "folder",
        config: {
            path: "",
            recursive: false,
        },
    },
    newFilesFolder: "",
    views: [],
};
exports.DEFAULT_SETTINGS = {
    projects: [],
    archives: [],
    preferences: {
        projectSizeLimit: 1000,
        frontmatter: {
            quoteStrings: "PLAIN",
        },
        locale: {
            firstDayOfWeek: "default",
        },
        commands: [],
        linkBehavior: "open-editor",
    },
};
//# sourceMappingURL=settings.js.map