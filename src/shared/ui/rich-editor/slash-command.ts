import type { ReactNode } from "react";
import { Extension, type Editor, type Range } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";

export type SlashCommandItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
};

type SlashCommandOptions = {
  suggestion: Omit<SuggestionOptions<SlashCommandItem, SlashCommandItem>, "editor">;
};

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const filterSuggestionItems = (
  items: SlashCommandItem[],
  query: string,
): SlashCommandItem[] => {
  if (!query) return items;
  const normalized = query.toLowerCase();
  return items.filter((item) => {
    if (item.title.toLowerCase().includes(normalized)) return true;
    if (item.description.toLowerCase().includes(normalized)) return true;
    return item.searchTerms.some((term) => term.toLowerCase().includes(normalized));
  });
};
