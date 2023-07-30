import i18next from "i18next";
import { createI18nStore } from "svelte-i18next";

import { moment } from "obsidian";

i18next.init({
  lng: moment.locale(),
  resources: {
    en: {
      translation: {
        "data-types": {
          string: "Text",
          number: "Number",
          boolean: "True or false",
          date: "Date",
          unknown: "Unknown data type",
          repeated: "Repeated field",
        },
        commands: {
          "show-projects": {
            name: "Show projects",
          },
          "create-project": {
            name: "Create new project",
          },
          "create-note": {
            name: "Create new note",
          },
        },
        menus: {
          project: {
            create: {
              title: "Create project in folder",
            },
          },
        },
        modals: {
          project: {
            create: {
              "short-title": "New project",
              untitled: "Untitled project",
              title: "Create new project",
              cta: "Create project",
              "existing-name-error": "A project with that name already exists.",
              "empty-name-error": "Project name can't be empty.",
            },
            edit: {
              "short-title": "Edit project",
              title: "Edit project",
              cta: "Save",
            },
            duplicate: {
              title: "Duplicate project",
            },
            delete: {
              "short-title": "Delete project",
              title: "Delete project",
              message: 'Are you sure you want to delete "{{project}}"?',
              cta: "Delete",
            },
            name: {
              name: "Name",
              description: "",
            },
            default: {
              name: "Set as default",
              description: "Enable to open this project by default.",
            },
            path: {
              name: "Path",
              description:
                "Path to the folder you want to manage. Leave empty to use root folder.",
            },
            tag: {
              name: "Tag",
              description: "Include all notes that have this tag.",
            },
            dataview: {
              name: "Use Dataview",
              description:
                "Use Dataview to query read-only data instead of using paths.",
              error: {
                title: "Dataview is disabled",
                message:
                  "Enable the Dataview plugin to continue using this project.",
              },
            },
            query: {
              name: "Query",
              description: "Only supports TABLE queries.",
            },
            recursive: {
              name: "Include subfolders",
              description:
                "Manage notes inside subfolders within the project path.",
            },
            templates: {
              name: "Templates",
              description:
                "Templates to choose from when you create new notes.",
            },
            exclude: {
              name: "Excluded notes",
              description:
                "Notes to exclude even if they would otherwise be part of the project.",
            },
            newNotesFolder: {
              name: "Location for new notes",
              description: "Folder where all new notes are placed.",
            },
            defaultName: {
              name: "Default name for new notes",
              description:
                "Supports {{date:YYYY-MM-DD}} and {{time:HHmm}} templates variables.",
              invalid: "Contains illegal characters.",
            },
          },
          view: {
            create: {
              "short-title": "New view",
              title: "Add new view",
              optional: "Optional",
              type: {
                name: "Type",
                description: "",
              },
              name: {
                name: "Name",
                description: "",
              },
              cta: "Add view",
              "existing-name-error": "A view with that name already exists.",
            },
            delete: {
              "short-title": "Delete view",
              title: "Delete view",
              message: 'Are you sure you want to delete the view "{{view}}"?',
              cta: "Delete",
            },
          },
          note: {
            create: {
              "short-title": "New note",
              title: "Create new note",
              name: {
                name: "Name",
                description: "",
              },
              templatePath: {
                name: "Template",
                description: "",
                none: "None",
              },
              project: {
                name: "Project",
                description: "",
              },
              "name-taken-error": "A note with that name already exists.",
              "empty-name-error": "Name can't be empty.",
              "dot-start-error": "File name must not start with a dot.",
              create: "Create note",
              readonly: {
                title: "Read-only project",
                message:
                  "{{project}} is a read-only project. Select another project to create a note.",
              },
              untitled: "Untitled note",
            },
            edit: {
              "short-title": "Edit note",
              title: "Edit note",
              save: "Save",
              "no-editable-fields": {
                title: "No editable fields",
                message: "This note has no editable fields.",
              },
            },
          },
          input: {
            cancel: "Cancel",
          },
          confirm: {
            delete: "Delete",
            cancel: "Cancel",
          },
        },
        views: {
          developer: {
            name: "Developer",
          },
          table: {
            name: "Table",
            "hide-fields": "Hide fields",
            "rename-field": "Rename field",
            rename: "Rename",
          },
          board: {
            name: "Board",
            "no-status": "No status",
            fields: {
              status: "Status",
              priority: "Priority",
              none: "None",
            },
            unprioritized: "Unprioritized",
            note: {
              add: "Add note",
            },
          },
          calendar: {
            name: "Calendar",
            "new-note": "New note",
            fields: {
              date: "Date",
              check: "Check",
              none: "None",
            },
            today: "Today",
            weekday: "{{value, datetime}}",
            date: "{{value, datetime}}",
            interval: "{{from, datetime}} – {{to, datetime}}",
            intervals: {
              month_one: "Month",
              month_other: "Months",
              monthWithCount_one: "{{count}} month",
              monthWithCount_other: "{{count}} months",
              week_one: "Week",
              week_other: "Weeks",
              weekWithCount_one: "{{count}} week",
              weekWithCount_other: "{{count}} weeks",
              day_one: "Day",
              day_other: "Days",
              dayWithCount_one: "{{count}} day",
              dayWithCount_other: "{{count}} days",
            },
          },
          gallery: {
            name: "Gallery",
            fields: {
              cover: "Cover",
              none: "None",
            },
            empty: "This view is empty.",
          },
        },
        components: {
          "data-grid": {
            column: {
              configure: "Configure field",
              rename: "Rename field",
              delete: "Delete field",
              hide: "Hide field",
            },
            row: {
              add: "Add note",
              edit: "Edit note",
              delete: "Delete note",
            },
            cell: {
              clear: "Clear value",
            },
            sort: {
              asc: "Sort A → Z",
              desc: "Sort Z → A",
            },
            sortDate: {
              asc: "Sort Old → New",
              desc: "Sort New → Old",
            },
          },
        },
        toolbar: {
          new: "New",
          view: {
            add: "Add view",
          },
          projects: {
            none: "No projects",
            options: "More options",
          },
          "read-only": "Read-only",
          "read-only-desc":
            "You can't create or edit notes in read-only projects.",
        },
        errors: {
          missingDataview: {
            title: "Dataview is disabled",
            message:
              "Enable the Dataview plugin to continue using this project.",
          },
        },
      },
    },
    "zh-CN": {
      translation: {
        "data-types": {
          string: "文本",
          number: "数值",
          boolean: "布尔",
          date: "日期",
          unknown: "未知",
          repeated: "周期",
        },
        commands: {
          "show-projects": {
            name: "打开项目",
          },
          "create-project": {
            name: "新建项目",
          },
          "create-note": {
            name: "新建笔记",
          },
        },
        menus: {
          project: {
            create: {
              title: "在文件夹中新建项目",
            },
          },
        },
        modals: {
          project: {
            create: {
              "short-title": "新项目",
              untitled: "未命名项目",
              title: "新建项目",
              cta: "新建项目",
              "existing-name-error": "项目名称重复",
              "empty-name-error": "项目名称不能为空",
            },
            edit: {
              "short-title": "编辑项目",
              title: "编辑项目配置",
              cta: "保存",
            },
            duplicate: {
              title: "复制项目",
            },
            delete: {
              "short-title": "删除项目",
              title: "删除项目",
              message: '确定要删除项目 "{{project}}" 吗？',
              cta: "删除",
            },
            name: {
              name: "名称",
              description: "",
            },
            default: {
              name: "设为默认项目",
              description: "打开 Projects 插件的窗口时，默认打开本项目",
            },
            path: {
              name: "路径",
              description: "本项目需要管理的路径。若为控制，路径将设为根目录",
            },
            tag: {
              name: "标签",
              description: "管理含有该标签的笔记",
            },
            dataview: {
              name: "Dataview",
              description: "以 Dataview 查询结果创建只读项目",
              error: {
                title: "Dataview 插件未启用",
                message: "启用 Dataview 插件以使用本项目",
              },
            },
            query: {
              name: "查询语句 (Query)",
              description: "只支持 TABLE 查询语句",
            },
            recursive: {
              name: "管理子文件夹",
              description: "管理项目文件夹下的所有子文件夹",
            },
            templates: {
              name: "模板",
              description: "新建笔记时，从以下模板中选取新笔记模板",
            },
            exclude: {
              name: "排除笔记",
              description: "此处记录的笔记将不会成为项目的一部分",
            },
            newNotesFolder: {
              name: "新建笔记位置",
              description: "新建的笔记将存放于指定文件夹",
            },
            defaultName: {
              name: "默认新笔记名称",
              description:
                "支持 {{date:YYYY-MM-DD}} 和 {{time:HHmm}} 格式的日期、时间模板变量",
              invalid: "含有非法字符",
            },
          },
          view: {
            create: {
              "short-title": "新建视图",
              title: "新建视图",
              optional: "可选",
              type: {
                name: "视图类型",
                description: "",
              },
              name: {
                name: "视图名称",
                description: "",
              },
              cta: "新建视图",
              "existing-name-error": "视图名称重复",
            },
            delete: {
              "short-title": "删除视图",
              title: "删除视图",
              message: '确定要删除视图 "{{view}}" 吗？',
              cta: "删除",
            },
          },
          note: {
            create: {
              "short-title": "新建笔记",
              title: "新建笔记",
              name: {
                name: "笔记名称",
                description: "",
              },
              templatePath: {
                name: "模板",
                description: "",
                none: "None",
              },
              project: {
                name: "所属项目",
                description: "",
              },
              "name-taken-error": "已经存在一个同名文件",
              "empty-name-error": "文件名不能为空。",
              "dot-start-error": "文件名不能以句点开头。",
              create: "新建笔记",
              readonly: {
                title: "只读项目",
                message: "{{project}} 是一个只读项目，请选择其他项目以新建笔记",
              },
              untitled: "未命名笔记",
            },
            edit: {
              "short-title": "编辑",
              title: "编辑笔记元数据",
              save: "保存",
              "no-editable-fields": {
                title: "没有可编辑字段",
                message: "这个笔记的元数据没有可编辑字段",
              },
            },
          },
          input: {
            cancel: "取消",
          },
          confirm: {
            delete: "删除",
            cancel: "取消",
          },
        },
        views: {
          developer: {
            name: "开发者视图",
          },
          table: {
            name: "表格视图",
            "hide-fields": "隐藏字段",
            "rename-field": "重命名字段",
            rename: "重命名",
          },
          board: {
            name: "看板视图",
            "no-status": "无状态字段",
            fields: {
              status: "状态",
              priority: "优先级",
              none: "无",
            },
            unprioritized: "未设置优先级",
            note: {
              add: "新建笔记",
            },
          },
          calendar: {
            name: "日历视图",
            "new-note": "新建笔记",
            fields: {
              date: "日期",
              check: "复选框",
              none: "无",
            },
            today: "今日",
            weekday: "{{value, datetime}}",
            date: "{{value, datetime}}",
            interval: "{{from, datetime}} – {{to, datetime}}",
            intervals: {
              month_one: "月",
              month_other: "月",
              monthWithCount_one: "{{count}} 月",
              monthWithCount_other: "{{count}} 月",
              week_one: "周",
              week_other: "周",
              weekWithCount_one: "{{count}} 周",
              weekWithCount_other: "{{count}} 周",
              day_one: "日",
              day_other: "日",
              dayWithCount_one: "{{count}} 日",
              dayWithCount_other: "{{count}} 日",
            },
          },
          gallery: {
            name: "画册视图",
            fields: {
              cover: "图片源",
              none: "无",
            },
            empty: "该视图还没有数据",
          },
        },
        components: {
          "data-grid": {
            column: {
              configure: "设置字段",
              rename: "重命名字段",
              delete: "删除字段",
              hide: "隐藏字段",
            },
            row: {
              add: "新建笔记",
              edit: "编辑笔记",
              delete: "删除笔记",
            },
            cell: {
              clear: "清空单元格",
            },
            sort: {
              asc: "A → Z 升序",
              desc: "Z → A 降序",
            },
            sortDate: {
              asc: "按日期升序",
              desc: "按日期升序Sort New → Old",
            },
          },
        },
        toolbar: {
          new: "新建",
          view: {
            add: "新建视图",
          },
          projects: {
            none: "尚无项目",
            options: "更多选项",
          },
          "read-only": "只读项目",
          "read-only-desc": "不能在只读项目中新增、编辑笔记",
        },
        errors: {
          missingDataview: {
            title: "Dataview 插件未启用",
            message: "启用 Dataview 插件以使用本项目",
          },
        },
      },
    },
  },
  interpolation: {
    escapeValue: false, // not needed for svelte as it escapes by default
  },
});

export const i18n = createI18nStore(i18next);
