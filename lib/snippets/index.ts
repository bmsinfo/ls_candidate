import * as monaco from "monaco-editor";
import { javaSnippets } from "./java";
import { pythonSnippets } from "./python";

export interface Snippet {
  label: string;
  documentation: string;
  insertText: string;
}

const languageToSnippetsMap: Record<string, Snippet[]> = {
  java: javaSnippets,
  python: pythonSnippets,
};

export const registerCompletionProvider = (
  monacoInstance: typeof monaco,
  language: string
) => {
  const snippets = languageToSnippetsMap[language];
  if (!snippets) {
    // handle in case for the language we dont have snippets
    return;
  }

  monacoInstance.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordAtPosition(position);
      const prefix = word ? word.word : "";
      const startColumn = position.column - prefix.length;
      const range = new monacoInstance.Range(
        position.lineNumber,
        startColumn,
        position.lineNumber,
        position.column
      );

      console.log({ language, snippets });
      const completionItems = snippets?.map((item) => ({
        ...item,
        range,
        kind: monacoInstance.languages.CompletionItemKind.Function,
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }));

      return { suggestions: completionItems };
    },
  });
};
