import { type Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export type KeywordAction =
  | 'repeat question'
  | 'clear answer'
  | 'submit answer';

export interface CodeEditorRef {
  resetCode: () => void;
  handleReadOnlyMode: (value: boolean) => void;
}

export interface CodeEditorProps extends React.RefAttributes<CodeEditorRef> {
  language: string;
  onCodeChange: (code: string) => void;
}

export interface CustomCodeEditorProps {
  onSubmit: (values: { answer: string }) => Promise<void>;
  // onSubmit: (values: {
  //   answer: string;
  // }) => Promise<{ success: boolean; error: string | true } | undefined>;

  codeEditorRef?: React.RefObject<CodeEditorRef>;
  children?: React.ReactNode;
}

export interface EditorConfig {
  minimap: { enabled: boolean };
  automaticLayout: boolean;
  suggestOnTriggerCharacters: boolean;
  quickSuggestions: boolean;
  contextmenu: boolean;
}

export interface VoiceConfig {
  voice: number;
  lang: number;
  engine: number;
}
