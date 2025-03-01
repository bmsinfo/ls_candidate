import { Snippet } from "./index";

export const pythonSnippets: Snippet[] = [
  {
    label: "def",
    documentation: "def function_name(args):",
    insertText: "def ${1:function_name}(${2:args}):\n\t${0:pass}",
  },
  {
    label: "for",
    documentation: "for item in iterable:",
    insertText: "for ${1:item} in ${2:iterable}:\n\t${0:# body}",
  },
  {
    label: "while",
    documentation: "while condition:",
    insertText: "while ${1:condition}:\n\t${0:# body}",
  },
  {
    label: "if",
    documentation: "if condition:",
    insertText: "if ${1:condition}:\n\t${0:# body}",
  },
  {
    label: "else",
    documentation: "else:",
    insertText: "else:\n\t${0:# body}",
  },
  {
    label: "elif",
    documentation: "elif condition:",
    insertText: "elif ${1:condition}:\n\t${0:# body}",
  },
  {
    label: "class",
    documentation: "class ClassName:",
    insertText:
      "class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${0:# constructor body}",
  },
  {
    label: "import",
    documentation: "import module_name",
    insertText: "import ${1:module_name}",
  },
  {
    label: "print",
    documentation: "print(value)",
    insertText: "print(${1:value})",
  },
  {
    label: "return",
    documentation: "return value",
    insertText: "return ${1:value}",
  },
  {
    label: "try",
    documentation: "try: ... except Exception as e:",
    insertText:
      "try:\n\t${0:# body}\nexcept ${1:Exception} as ${2:e}:\n\t${0:# handle exception}",
  },
  {
    label: "with",
    documentation: "with open(filename) as file:",
    insertText: "with ${1:open(filename)} as ${2:file}:\n\t${0:# body}",
  },
  {
    label: "lambda",
    documentation: "lambda args: expression",
    insertText: "lambda ${1:args}: ${2:expression}",
  },
  {
    label: "list",
    documentation: "[item1, item2, item3]",
    insertText: "[${1:item1}, ${2:item2}, ${3:item3}]",
  },
  {
    label: "dic",
    documentation: "{key: value}",
    insertText: "{${1:key}: ${2:value}}",
  },
  {
    label: "set",
    documentation: "set([item1, item2, item3])",
    insertText: "set([${1:item1}, ${2:item2}, ${3:item3}])",
  },
  {
    label: "tuple",
    documentation: "(item1, item2, item3)",
    insertText: "(${1:item1}, ${2:item2}, ${3:item3})",
  },
  {
    label: "async",
    documentation: "async def function_name(args):",
    insertText: "async def ${1:function_name}(${2:args}):\n\t${0:pass}",
  },
];
