import React, { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import ClearSubmitButton from '@/app/(interview)/interview/_components/ClearSubmitButton';
import DeepgramToggler from '@/app/(interview)/interview/_components/DeepgramToggler';
import LabelWithToggler from '@/app/(interview)/interview/_components/LabelWithToggler';
import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import { loggerAPI } from '@/lib/logger';
import { getBasicCodeSnippets, type SupportedLanguage } from '@/lib/utils';
import { useDeepgram } from '@/providers/DeepgramContextProvider';

import LanguageSelector, { LangaugeSelectorRef } from './LanguageSelector';
import { Editor } from './MonacoEditor';
import { useEditorActions } from './hooks/useEditorActions';
import { CodeEditorRef, CustomCodeEditorProps, KeywordAction } from './types';

const KEYWORDS = {
  'repeat question': 'repeatQuestionDispatchEvent',
  'clear answer': 'clearAnswerDispatchEvent',
  'submit answer': 'submitAnswerDispatchEvent',
} as const;

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = React.memo(
  ({ onSubmit, children }) => {
    const { deepgramText, resetDeepgramText } = useDeepgram();
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('javascript');
    const isSubmitingAnswer = useUIStore((state) => state.isSubmitingAnswer);
    const isMobile = useUIStore((state) => state.isMobile);

    const currentQuestion = useStore((state) => state.currentQuestion);

    const codeEditorRef = useRef<CodeEditorRef | null>(null);
    const languageSelectorRef = useRef<LangaugeSelectorRef | null>(null);
    const codingAnswerRef = useRef<string>(
      getBasicCodeSnippets('javascript' as SupportedLanguage),
    );

    const { repeatQuestion, clearAnswer, submitAnswer } = useEditorActions(
      codeEditorRef,
      codingAnswerRef,
      onSubmit,
      resetDeepgramText,
    );

    const handleLanguageChange = useCallback(
      (value: string) => {
        setLanguage(value);
        codingAnswerRef.current = getBasicCodeSnippets(
          value as SupportedLanguage,
        );

        loggerAPI({
          event: 'coding_language_change',
          status: 'coding language changed',
          data: { language: value },
        });

        if (error) {
          console.log('#### inside error ###');
          setError('');
        }
        setError('');
      },
      [error, codingAnswerRef],
    );

    const handleSubmit = useCallback(async () => {
      try {
        codeEditorRef.current?.handleReadOnlyMode(true);
        // TODO: will need to get the value from code editor it self :  codeEditorRef.current?.getValue(),
        // need to remove the codingAnswerRef useRef
        await submitAnswer();
        languageSelectorRef.current?.resetLanguage();
      } catch (err) {
        setError((err as Error).message);
        toast.error((err as Error).message);
      } finally {
        codeEditorRef.current?.handleReadOnlyMode(false);
      }
    }, [submitAnswer, codeEditorRef, languageSelectorRef]);

    const resetHandler = useCallback(() => {
      setError('');
      codeEditorRef.current?.resetCode();
      codingAnswerRef.current = '';
      languageSelectorRef.current?.resetLanguage(); // reset language to javascript
    }, [codeEditorRef, codingAnswerRef]);

    const processText = useCallback((text: string) => {
      return (Object.keys(KEYWORDS) as KeywordAction[]).reduce(
        (processedText, keyword) => {
          if (processedText.toLowerCase().includes(keyword)) {
            window.dispatchEvent(new Event(KEYWORDS[keyword]));
            return processedText.replace(new RegExp(keyword, 'ig'), '').trim();
          }
          return processedText;
        },
        text,
      );
    }, []);

    useEffect(() => {
      processText(deepgramText);
    }, [deepgramText, processText]);

    useEffect(() => {
      const actions = {
        repeatQuestionDispatchEvent: repeatQuestion,
        clearAnswerDispatchEvent: clearAnswer,
        submitAnswerDispatchEvent: handleSubmit,
      };

      Object.values(KEYWORDS).forEach((event) => {
        window.addEventListener(event, actions[event as keyof typeof actions]);
      });

      return () => {
        Object.values(KEYWORDS).forEach((event) => {
          window.removeEventListener(
            event,
            actions[event as keyof typeof actions],
          );
        });
      };
    }, [repeatQuestion, clearAnswer, submitAnswer]);

    useEffect(() => {
      if (currentQuestion) {
        resetHandler();
      }
    }, [currentQuestion]);

    return (
      <div className="w-full h-full flex flex-col gap-2">
        <LabelWithToggler variant={isMobile ? 'mobile' : 'desktop'}>
          <LanguageSelector
            ref={languageSelectorRef}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </LabelWithToggler>
        <div className="h-full">
          <div className="relative h-full flex flex-col w-full rounded-md  gap-2">
            <div
              id="tour-guide-answer-box"
              className="h-[calc(100%-8rem)] md:h-[calc(100%-50px)]">
              <Editor
                ref={codeEditorRef}
                language={language}
                onCodeChange={(code) => {
                  codingAnswerRef.current = code;
                  setError('');
                }}
              />
            </div>
            <div className="absolute bottom-0 right-0 flex w-full items-center justify-between h-auto">
              <p
                id="log-message-id"
                className="text-[0.7rem] font-normal text-red-400">
                {error}
              </p>
              <div className="flex flex-col items-center justify-center gap-2">
                {isMobile && (
                  <DeepgramToggler classNames="md:hidden justify-end" />
                )}

                <ClearSubmitButton
                  clearHandler={() => {
                    setError('');
                    codeEditorRef.current?.resetCode();
                    codingAnswerRef.current = '';
                  }}
                  isSubmiting={isSubmitingAnswer}
                  onSubmitHandler={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CustomCodeEditor.displayName = 'CustomCodeEditor';
export default CustomCodeEditor;
