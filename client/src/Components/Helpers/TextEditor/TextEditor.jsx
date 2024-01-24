import './TextEditor.css'
import './Tiptap.css'

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import FeatherPenImg from '../../../assets/featherPen.png'
import ImageImg from '../../../assets/image.png'
import RephraseWordImg from '../../../assets/rephraseWord.png'
import ExpandWordImg from '../../../assets/expandWord.png'
import UndoImg from '../../../assets/undo.png'
import RedoImg from '../../../assets/redo.png'
import BoldImg from '../../../assets/bold.png'
import ItalicImg from '../../../assets/italic.png'
import UnderlineImg from '../../../assets/underline.png'
import UnorderlistImg from '../../../assets/unorderlist.png'
import OrderlistImg from '../../../assets/orderlist.png'
import { useEffect, useState } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  
    return (
      <div className='menuBar'>
        <span className="options">
            <img src={FeatherPenImg} alt="feather pen" />
            <p>Write</p>
        </span>
        <span className="options">
            <img src={ImageImg} alt="ai image" />
            <p>AI image</p>
        </span>
        <span className="options">
            <img src={RephraseWordImg} alt="repharse word"/>
            <p>Rephrase words</p>
        </span>
        <span className="options">
            <img src={ExpandWordImg} alt="expand word" />
            <p>Expand word</p>
        </span>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          <img src={UndoImg} alt="bold" className="tapIcon" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          <img src={RedoImg} alt="bold" className="tapIcon" />
        </button>
        <hr />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <img src={BoldImg} alt="bold" className="tapIcon" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
            <img src={ItalicImg} alt="italic" className="tapIcon" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is_active" : ""}
        >
          <img src={UnderlineImg} alt='underline' clasName='tapIcon' />
        </button>
        {/**
         * 
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          strike
        </button>
         */}
        {/**
         * 
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          code
        </button>
         */}
        {/**
         * 
         <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
           clear marks
         </button>
         */}
        {/**
         * 
         <button onClick={() => editor.chain().focus().clearNodes().run()}>
           clear nodes
         </button>
         */}
        {/**
         * 
         <button
           onClick={() => editor.chain().focus().setParagraph().run()}
           className={editor.isActive('paragraph') ? 'is-active' : ''}
         >
           paragraph
         </button>
         */}
         {/**
          * 
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          h2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          h3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          h4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          h5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          h6
        </button>
          */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <img src={UnorderlistImg} alt="bold" className="tapIcon" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <img src={OrderlistImg} alt="bold" className="tapIcon" />
        </button>
        {/**
         * 
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          code block
        </button>
         */}
         {/**
          * 
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            blockquote
          </button>
          */}
        {/**
         * 
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          horizontal rule
        </button>
         */}
        {/**
         * 
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          hard break
        </button>
         */}

        {/**
         * 
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          purple
        </button>
         */}
      </div>
    )
  }
  

  const useTiptapEditor = (content) => {
    const editor = useEditor({
      extensions: [StarterKit, Underline],
      content: `${content}`,
    });
  
    useEffect(() => {
      if (editor) {
        editor.chain().setContent(`${content}`).run();
      }
    }, [editor, content])
  
    return editor
  }

function TextEditor({ content }) {
  const editor = useTiptapEditor(content);

  console.log('CONTENT', content);
  return (
    <div className="textEditor">
      <MenuBar editor={editor} />
      <div className="editorContentArea">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor