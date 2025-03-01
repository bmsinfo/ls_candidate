import React, {
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import { registerCompletionProvider } from '@/lib/snippets/index';
import { getBasicCodeSnippets, type SupportedLanguage } from '@/lib/utils';

import { CodeEditorProps, CodeEditorRef } from './types';

export const EDITOR_CONFIG = {
  minimap: { enabled: false },
  automaticLayout: true,
  // scrollBeyondLastLine: false,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  contextmenu: false,
};

export const Editor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ language, onCodeChange }, ref) => {
    const monaco = useMonaco();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const resetCode = useCallback(() => {
      editorRef?.current?.setValue('');
    }, [editorRef]);

    const handleReadOnlyMode = useCallback(
      (value: boolean) => {
        editorRef.current?.updateOptions({ readOnly: value });
      },
      [editorRef],
    );

    useImperativeHandle(ref, () => ({ resetCode, handleReadOnlyMode }));

    useEffect(() => {
      if (monaco) {
        registerCompletionProvider(monaco, language);
      }
    }, [monaco, language]);

    const handleEditorDidMount = useCallback(
      (editor: monaco.editor.IStandaloneCodeEditor) => {
        // create reference to the editor
        editorRef.current = editor;
        // Disable copy and paste via keyboard shortcuts

        editor.onKeyDown((e: any) => {
          if (
            (e.ctrlKey || e.metaKey) &&
            (e.code === 'KeyC' || e.code === 'KeyV')
          ) {
            e.preventDefault();
          }
        });

        // Disable paste action directly
        editor.onDidPaste(() => false);
        // Add content change listener : resolve issue when remove the code by using shortcut keys
        editor.onDidChangeModelContent(() => {
          console.log('editor.onDidChangeModelContent');
          const content = editor.getValue().trim();
          onCodeChange(content);
        });
      },
      [editorRef],
    );

    return (
      <div className="border rounded-lg pb-1 h-full w-full">
        <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
          <span className="font-mono text-sm capitalize">{language}</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <MonacoEditor
          className="py-1 mb-8 w-full h-auto"
          language={language}
          value={getBasicCodeSnippets(language as SupportedLanguage)}
          onMount={handleEditorDidMount}
          // TODO: will implement in future ir required , if used then we need to  comment out the  'editor.onDidChangeModelContent' code
          // onChange={(value) => value && onCodeChange(value)}
          defaultValue="// Start typing your code here..."
          options={EDITOR_CONFIG}
        />
      </div>
    );
  },
);

Editor.displayName = 'Editor';
