import * as monaco from "monaco-editor";

export const createCompletionItem = (
  label: string,
  insertText: string,
  documentation: string
) => {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Function,
    insertText,
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation,
    range: new monaco.Range(0, 0, 0, 0), // Placeholder, will be adjusted in provider
  };
};

export const javaSnippets = [
  createCompletionItem(
    "for",
    "for (${1:initialization}; ${2:condition}; ${3:increment}) {\n\t${0:// body}\n}",
    "For loop structure"
  ),
  createCompletionItem(
    "while",
    "while (${1:condition}) {\n\t${0:// body}\n}",
    "While loop structure"
  ),
  createCompletionItem(
    "if",
    "if (${1:condition}) {\n\t${0:// body}\n}",
    "If statement structure"
  ),
  createCompletionItem(
    "else",
    "else {\n\t${0:// body}\n}",
    "Else statement structure"
  ),
  createCompletionItem(
    "switch",
    "switch (${1:variable}) {\n\tcase ${2:value}:\n\t\t${0:// body}\n\t\tbreak;\n\tdefault:\n\t\t${0:// body}\n}",
    "Switch statement structure"
  ),
  createCompletionItem(
    "try",
    "try {\n\t${0:// body}\n} catch (${1:Exception} ${2:e}) {\n\t${0:// handle exception}\n}",
    "Try-catch block structure"
  ),
  createCompletionItem(
    "class",
    "public class ${1:ClassName} {\n\t${0:// body}\n}",
    "Class definition"
  ),
  createCompletionItem(
    "method",
    "public ${1:void} ${2:methodName}(${3:parameters}) {\n\t${0:// body}\n}",
    "Method definition"
  ),
  createCompletionItem(
    "main",
    "public static void main(String[] args) {\n\t${0:// body}\n}",
    "Main method definition"
  ),
  createCompletionItem(
    "System.out.println",
    "System.out.println(${1:value});",
    "Print to console"
  ),
  createCompletionItem(
    "new",
    "new ${1:ClassName}(${2:arguments});",
    "Instantiate a new object"
  ),
  createCompletionItem("return", "return ${1:value};", "Return statement"),
  createCompletionItem("public", "public ", "Public access modifier"),
  createCompletionItem("private", "private ", "Private access modifier"),
  createCompletionItem("protected", "protected ", "Protected access modifier"),
  createCompletionItem("static", "static ", "Static keyword"),
  createCompletionItem("final", "final ", "Final keyword"),
  createCompletionItem(
    "interface",
    "public interface ${1:InterfaceName} {\n\t${0:// methods}\n}",
    "Interface definition"
  ),
  createCompletionItem(
    "abstract",
    "public abstract ${1:void} ${2:methodName}(${3:parameters});",
    "Abstract method declaration"
  ),
  createCompletionItem(
    "enum",
    "public enum ${1:EnumName} {\n\t${0:// values}\n}",
    "Enumeration declaration"
  ),
];

export const pythonSnippets = [
  createCompletionItem(
    "def",
    "def ${1:function_name}(${2:args}):\n\t${0:pass}",
    "Function definition"
  ),
  createCompletionItem(
    "for",
    "for ${1:item} in ${2:iterable}:\n\t${0:# body}",
    "For loop structure"
  ),
  createCompletionItem(
    "while",
    "while ${1:condition}:\n\t${0:# body}",
    "While loop structure"
  ),
  createCompletionItem(
    "if",
    "if ${1:condition}:\n\t${0:# body}",
    "If statement structure"
  ),
  createCompletionItem(
    "else",
    "else:\n\t${0:# body}",
    "Else statement structure"
  ),
  createCompletionItem(
    "elif",
    "elif ${1:condition}:\n\t${0:# body}",
    "Else if statement structure"
  ),
  createCompletionItem(
    "class",
    "class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${0:# constructor body}",
    "Class definition"
  ),
  createCompletionItem("import", "import ${1:module_name}", "Import a module"),
  createCompletionItem("print", "print(${1:value})", "Print to console"),
  createCompletionItem("return", "return ${1:value}", "Return statement"),
  createCompletionItem(
    "try",
    "try:\n\t${0:# body}\nexcept ${1:Exception} as ${2:e}:\n\t${0:# handle exception}",
    "Try-except block"
  ),
  createCompletionItem(
    "with",
    "with ${1:open(filename)} as ${2:file}:\n\t${0:# body}",
    "With statement for resource management"
  ),
  createCompletionItem(
    "lambda",
    "lambda ${1:args}: ${2:expression}",
    "Lambda function"
  ),
  createCompletionItem(
    "list",
    "[${1:item1}, ${2:item2}, ${3:item3}]",
    "List creation"
  ),
  createCompletionItem("dict", "{${1:key}: ${2:value}}", "Dictionary creation"),
  createCompletionItem(
    "set",
    "set([${1:item1}, ${2:item2}, ${3:item3}])",
    "Set creation"
  ),
  createCompletionItem(
    "tuple",
    "(${1:item1}, ${2:item2}, ${3:item3})",
    "Tuple creation"
  ),
  createCompletionItem(
    "async",
    "async def ${1:function_name}(${2:args}):\n\t${0:pass}",
    "Asynchronous function definition"
  ),
];

// Register Python completion item provider

export const registerPythonCompletionProvider = (
  monacoInstance: typeof monaco
) => {
  monacoInstance.languages.registerCompletionItemProvider("python", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordAtPosition(position);
      const prefix = word ? word.word : "";
      const startColumn = position.column - prefix.length;
      const range = new monaco.Range(
        position.lineNumber,
        startColumn,
        position.lineNumber,
        position.column
      );

      const completionItems = pythonSnippets.map((item) => ({
        ...item,
        range,
      }));

      return { suggestions: completionItems };
    },
  });
};
