import { Snippet } from "./index";

export const javaSnippets: Snippet[] = [
  {
    label: "System.out.println",
    documentation: "Prints a message to the console",
    insertText: "System.out.println(${1:message});",
  },
  {
    label: "For loop",
    documentation: "A basic for loop",
    insertText:
      "for (${1:type} ${2:variable} : ${3:iterable}) {\n\t${4:body}\n}",
  },
  {
    label: "If statement",
    documentation: "A basic if statement",
    insertText: "if (${1:condition}) {\n\t${2:body}\n}",
  },
];
