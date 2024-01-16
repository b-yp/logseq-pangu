import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const settings: SettingSchemaDesc[] = [
  {
    key: "shortcutKey",
    title: "Shortcut keys",
    description: "Shortcut key for format page.",
    type: "string",
    default: "shift+alt+f",
  },
];
