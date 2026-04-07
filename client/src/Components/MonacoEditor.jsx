import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import starterCode from "../assets/starterCode";

function monacoEditor({ language, theme = "vs-light", editorRef, className }) {
  function onMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  return (
    <Editor
      language={language}
      value={starterCode[language]}
      options={{
        fontSize: 16,
        fontFamily: "Roboto Mono, monospace",
        overviewRulerLanes: 0,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 2,
        scrollbar: { vertical: "visible" },
      }}
      defaultValue={starterCode[language]}
      onMount={onMount}
      theme={theme}
      className={className}
    />
  );
}

export default monacoEditor;
