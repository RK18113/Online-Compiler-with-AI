import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';

function monacoEditor({ language, theme = "vs-dark", codeChange}) {
    const editorRef = useRef(null);
    const starterCode = {
        javascript: `// JavaScript Starter Code
      console.log("Hello, World!");`,
      
        python: `# Python Starter Code
      print("Hello, World!")`,
      
        c: `// C Starter Code
      #include <stdio.h>
      
      int main() {
          printf("Hello, World!\\n");
          return 0;
      }`,
      
        cpp: `// C++ Starter Code
      #include <iostream>
      
      int main() {
          std::cout << "Hello, World!" << std::endl;
          return 0;
      }`
    };


    function onMount(editor){
        editorRef.current = editor;
        editor.focus();
    }

    return (
        <Editor 
            width="55vw"
            language={language} 
            value={starterCode[language]}
            defaultValue={starterCode[language]}
            onMount={onMount}
            theme={theme}
            onChange={(value) => codeChange(value)}
        />
    )
}

export default monacoEditor