import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "quill-emoji";
import Focus from "quill-focus"
import "quill-emoji/dist/quill-emoji.css";
import QuillCursors from 'quill-cursors';
import 'quill-paste-smart';
import quillBetterTable from 'quill-better-table';
import htmlEditButton from "quill-html-edit-button";

import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css"; 
import "./App.css";

Quill.register("modules/focus", Focus);
Quill.register('modules/cursors', QuillCursors);
Quill.register({
  'modules/better-table': quillBetterTable,
}, true);
Quill.register({"modules/htmlEditButton": htmlEditButton})

function App() {
  const [text, setText] = useState("");
  const editorRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const searchTextRef = useRef(null);
  const replaceTextRef=useRef(null)

  useEffect(() => {
    if(!editorRef.current){
      Quill.register("modules/better-table", quillBetterTable, true);
    const editor = new Quill("#editor", {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        
          ['blockquote', 'code-block'],
        
          [{ 'header': 1 }, { 'header': 2 }],              
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],     
          [{ 'indent': '-1'}, { 'indent': '+1' }],         
        
          [{ 'size': ['small', false, 'large', 'huge'] }], 
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
          [{ 'color': [] }, { 'background': [] }],       
          [{ 'font': [] }],
          [{ 'align': [] }],
        
          ['clean'] ,
          ['emoji'],
        ],

        focus: {
          focusClass: "focused-blot", 
        },
        clipboard: {
          allowed: {
            tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
            attributes: ['href', 'rel', 'target', 'class']
          },
          keepSelection: true,
          substituteBlockElements: true,
          magicPasteLinks: true,
          hooks: {
            uponSanitizeElement(node, data, config) {
              console.log(node);
            },
          },
        },
        htmlEditButton: {},
        table: false,
          // 'better-table': {
          //   operationMenu: {
          //     items: {
          //       unmergeCells: {
          //         text: 'Another unmerge cells name',
          //       },
          //     },
          //   },
          // },
          // keyboard: {
          //   bindings: quillBetterTable.keyboardBindings
          // },
        "emoji-toolbar": true, 
        "cursors": true, 
        "focus": true,
        // 'better-table': true,
        // "autoformat": true
      },

      theme: "snow",
    });

    editorRef.current = editor;
    document.querySelector('#get-contents').onclick = () => {
      updateDeltaView(editor);
    };

    editor.on("text-change", function () {
      handleChange(editor.root.innerHTML);
    });


    return () => {
      editor.off("text-change");
      // editor.destroy();
    };
  }
  }, []);


  const handleSearch = () => {
    const quill = editorRef.current;
    const searchText = searchTextRef?.current.value?.toLowerCase();
  
    quill.removeFormat(0, quill?.getLength());
  
    if (searchText) {
      const text = quill.getText()?.toLowerCase();
      let index = text?.indexOf(searchText);
  
      while (index !== -1) {
        quill?.formatText(index, searchText.length, { background: "#FFFF00" });
        index = text?.indexOf(searchText, index + 1);
      }
    }
  };
  
  const handleReplace = () => {
    const quill = editorRef.current;
    const searchText = searchTextRef.current.value?.toLowerCase();
    const replaceText = replaceTextRef.current.value;
  
    quill.removeFormat(0, quill.getLength());
  
    if (searchText && replaceText) {
      const content = quill.getContents();
      const delta = content.ops.map((op) => {
        if (typeof op.insert === "string") {
          const lowerInsert = op.insert?.toLowerCase();
          const index = lowerInsert?.indexOf(searchText);
          if (index !== -1) {
            const replacedText = lowerInsert?.replace(searchText, replaceText);
            return { ...op, insert: replacedText };
          }
        }
        return op;
      });
  
      quill.setContents(delta);
    }
  };
  

  function updateDeltaView(quill) {
    document.querySelector('#delta-view').innerHTML = JSON.stringify(
      quill.getContents()
    );
  }

  

  function handleChange(value) {
    setText(value);
  }

  const handleInsertTable = () => {
    const tableModule = editorRef.current?.getModule("better-table");
    console.log(tableModule,editorRef,"tableModule")
    if (tableModule) {
      tableModule?.insertTable(3, 3);
    }
  };

  const handleGetTable = () => {
    const tableModule = editorRef.current?.getModule("better-table");
    if (tableModule) {
      console.log(tableModule.getTable());
    }
  };



  return (
    <div className="App">
     <div id="toolbar">
        <button onClick={handleInsertTable}>Insert Table</button>
        <button onClick={handleGetTable}>Get Table</button>
        <button id="get-contents">Get Contents</button>
        <div>
        <label>Search:</label>
        <input
          type="text"
          ref={searchTextRef}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        </div>
        <div>
        <label>Replace:</label>
        <input
          type="text"
          ref={replaceTextRef}
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <button onClick={handleReplace}>Replace</button>
      </div>
      </div>

      <div id="editor" style={{height:"400px"}} />
      <div id="delta-view"></div>
    </div>
  );
}

export default App;
