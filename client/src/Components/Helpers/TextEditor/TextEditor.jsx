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
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { generateChapterImage, rewriteChapter } from '../../../helpers/api';

const MenuBar = ({ editor, content }) => {
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ newChapter, setNewChapter ] = useState(false)
  const [ newImage, setNewImage ] = useState(false)

  if (!editor) {
    return null;
  }

  const handleNewChapter = async (text, chapterId) => {
    if(text === undefined){
      toast.error('Select chapter in table of content')
    }
    try {
      setNewChapter(true)
      const res = await rewriteChapter({ text, userId, storyId, chapterId })
    } catch (error) {
      
    } finally {
      setNewChapter(false)
    }
  }

  const handleChapterImage = async (text, chapterId) => {
    if(text === undefined){
      toast.error('Select chapter in table of content')
    }
    try {
      setNewImage(true)
      const res = await generateChapterImage({ text, userId, storyId, chapterId })
    } catch (error) {
      
    } finally {
      setNewImage(false)
    }
  }

    return (
      <div className='menuBar'>
        <button disabled={newChapter} className="options" onClick={() => handleNewChapter(content?.chapterContent, content._id)}>
            <img src={FeatherPenImg} alt="feather pen" />
            <p>{newChapter ? 'Writing...' : 'Write'}</p>
        </button>
        <button disabled={newImage} className="options" onClick={() => handleChapterImage(content?.chapterContent, content._id)}>
            <img src={ImageImg} alt="ai image" />
            <p>{newImage ? 'Generating...' : 'AI image'}</p>
        </button>
        <button className="options">
            <img src={RephraseWordImg} alt="repharse word"/>
            <p>Rephrase words</p>
        </button>
        <button className="options">
            <img src={ExpandWordImg} alt="expand word" />
            <p>Expand word</p>
        </button>
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
      </div>
    )
  }
  

  const useTiptapEditor = (content, onEditorChange) => {
    const editor = useEditor({
      extensions: [StarterKit, Underline],
      content: `${content}`,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        onEditorChange(newContent)
      },
    });
  
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.chain().focus().setContent(content).run();
      }
    }, [editor, content])
  
    return editor
  }

function TextEditor({ content, onEditorChange, defaultContent, image }) {
  const editor = useTiptapEditor(content?.chapterContent || defaultContent, onEditorChange);
  

  //console.log('CONTENT', content);
  return (
    <div className="textEditor">
      <MenuBar editor={editor} content={content} />
      <div className="editorContentArea">
        <EditorContent editor={editor} />
        <img src={content?.chapterImage ? content?.chapterImage : image} className='editorImg' />
      </div>
    </div>
  )
}

export default TextEditor