import React, { useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "quill-emoji";
import Focus from "quill-focus"
import "quill-emoji/dist/quill-emoji.css";
import QuillCursors from 'quill-cursors';
import 'quill-paste-smart';
import QuillBetterTable from 'quill-better-table'

import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css"; 

import "./App.css";

Quill.register("modules/focus", Focus);
Quill.register('modules/cursors', QuillCursors);
Quill.register({ 'modules/better-table': QuillBetterTable }, true);

function App() {
  const [text, setText] = useState("");

  useEffect(() => {

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
          ['table']
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
      table: false,  // disable table module
      // 'better-table': {
      //   operationMenu: {
      //     items: {
      //       unmergeCells: {
      //         text: 'Another unmerge cells name'
      //       }
      //     }
      //   }
      // },
      keyboard: {
        bindings: QuillBetterTable.keyboardBindings
      },

        "emoji-toolbar": true, 
        "cursors": true,   
        // "autoformat": true   
      },

      theme: "snow",
    });


    let tableModule = editor?.getModule('better-table');
    console.log(editor,tableModule,"tableModule")

    document.querySelector('#insert-table').onclick = () => {
      tableModule.insertTable(3, 3);
    };
    


    document.querySelector('#get-table').onclick = () => {
      console.log(tableModule.getTable());
    };

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
  }, []);

  function updateDeltaView(quill) {
    document.querySelector('#delta-view').innerHTML = JSON.stringify(
      quill.getContents()
    );
  }

  

  function handleChange(value) {
    setText(value);
  }

  return (
    <div>
      {/* <head><title>
      <script src="/path/to/quill.min.js"></script>
<script src="/path/to/quill-autoformat.js"></script>
</title></head> */}
      <div id="toolbar" >
      <button id="insert-table">Insert Table</button>
        <button id="get-table">Get Table</button>
        <button id="get-contents">Get Contents</button>
      </div>
      <div id="editor" style={{height:"400px"}} />
      <div id="delta-view"></div>
    </div>
  );
}

export default App;
