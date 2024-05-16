import './WriterEditor.css'
import './Tiptap.css'

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import FeatherPenImg from '../../../../assets/featherPen.png'
import ImageImg from '../../../../assets/image.png'
import RephraseWordImg from '../../../../assets/rephraseWord.png'
import ExpandWordImg from '../../../../assets/expandWord.png'
import UndoImg from '../../../../assets/undo.png'
import RedoImg from '../../../../assets/redo.png'
import BoldImg from '../../../../assets/bold.png'
import ItalicImg from '../../../../assets/italic.png'
import UnderlineImg from '../../../../assets/underline.png'
import UnorderlistImg from '../../../../assets/unorderlist.png'
import OrderlistImg from '../../../../assets/orderlist.png'
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { generateChapterImage, rewriteChapter, synonymWord } from '../../../../helpers/api';
import { signInSuccess } from '../../../../redux/user/userslice';
import { useDispatch } from 'react-redux';

const MenuBar = ({ editor, content, choosenWord, setChoosenWord }) => {
  const dispatch = useDispatch()
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ newChapter, setNewChapter ] = useState(false)
  const [ newImage, setNewImage ] = useState(false)
  const [ repharsingWord, setRepharsingWord ] = useState(false)

 
  if (!editor) {
    return null;
  }

  const handleNewChapter = async (text, chapterId) => {
    if(text === undefined){
      toast.error('Select chapter in Chapter tab')
      return
    }
    try {
      setNewChapter(true)
      const res = await rewriteChapter({ text, userId, storyId, chapterId })
      console.log('RES from rewrite chapter', res)
      if(res?.data.success){
        dispatch(signInSuccess(res?.data.user))
        window.location.reload()
      }
    } catch (error) {
      
    } finally {
      setNewChapter(false)
    }
  }

  const handleChapterImage = async (text, chapterId) => {
    if(text === undefined){
      toast.error('Select chapter in table of content')
      return
    }
    try {
      setNewImage(true)
      const res = await generateChapterImage({ text, userId, storyId, chapterId })
      if(res?.data.success){
        dispatch(signInSuccess(res?.data.user))
        window.location.reload()
      }
    } catch (error) {
      
    } finally {
      setNewImage(false)
    }
  }

const handleSynonymWord = async (text) => {
  const word = choosenWord
  if(!word){
    toast.error('Please highlight a word')
    return
  }
  if(text === undefined){
    toast.error('Select chapter in table of content')
    return
  }
  try {
    setRepharsingWord(true)
    const res = await synonymWord({ word })
    if(res?.success){
      toast.success(res.data);
      const newWord = res.data;
      const currentContent = editor.getHTML();
      const updatedContent = currentContent.replace(new RegExp(word, 'g'), newWord);
      editor.commands.setContent(updatedContent);
      setChoosenWord(newWord);
    }
  } catch (error) {
    console.log('ERROR REPHARSING WORD', error)
  } finally {
    setRepharsingWord(false)
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
        <button className="options" >
            <img src={RephraseWordImg} alt="repharse word"/>
            <p>Rephrase words</p>
        </button>
        <button className="options" onClick={() => handleSynonymWord(content?.chapterContent)}>
            <img src={ExpandWordImg} alt="expand word" />
            <p>{repharsingWord ? 'Checking...' : 'Synonym word'}</p>
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
        <p>{choosenWord}</p>
      </div>
    )
  }
  

  const useTiptapEditor = (content, onEditorChange) => {
    const [streaming, setStreaming] = useState(false);
    const editor = useEditor({
      extensions: [StarterKit, Underline],
      content: `${content}`,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        onEditorChange(newContent);
      },
    });
  
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.chain().focus().setContent(content).run();
      }
    }, [editor, content]);
  
    const streamText = (text) => {
      if (!editor) return;
      setStreaming(true);
      editor.commands.clearContent();
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          if (text.startsWith('<')) {
            const nextIndex = text.indexOf('>', index) + 1;
            const htmlSubstring = text.substring(index, nextIndex);
            editor.commands.insertContent(htmlSubstring);
            index = nextIndex;
          } else {
            if (/\s/.test(text.charAt(index))) {
              editor.commands.insertContent('\u00A0');
            } else {
              editor.commands.insertContent(text.charAt(index));
            }
            index++;
          }
        } else {
          clearInterval(interval);
          setStreaming(false);
        }
      }, 50); // Adjust the speed by changing the interval delay
    };
  
    return { editor, streamText, streaming };
  };

  
function WriterEditor({ content, onEditorChange, defaultContent, image, setSelectedWords, selectedWords }) {
  const { editor, streamText, streaming } = useTiptapEditor(content?.chapterContent || defaultContent, onEditorChange);
  const selectedWordRef = useRef(null);
  const [ choosenWord, setChoosenWord ] = useState('')

  useEffect(() => {
      if(content?.chapterContent || defaultContent) {
        console.log("Content to stream:", content?.chapterContent);
        if (!streaming) {
          const textToStream = content?.chapterContent || defaultContent;
          console.log("Text to stream:", textToStream);
          streamText(textToStream);
        }
    }
  }, [streaming]);

  const handleSelectedWord = () => {
    const selectedWord = window.getSelection().toString().trim();
    if (selectedWord) {
      selectedWordRef.current = selectedWord;
      setChoosenWord(selectedWord);
    }
  };

  const handleLeftClick = (event) => {
    if (event.button === 0) { // Left click
      const selectedWordGroup = window.getSelection().toString().trim();
      if (selectedWordGroup && !selectedWords.includes(selectedWordGroup)) {
        //setSelectedWords(prevSelectedWords => [...prevSelectedWords, selectedWordGroup]);
        setSelectedWords([selectedWordGroup]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleLeftClick);
    return () => {
      document.removeEventListener('mousedown', handleLeftClick);
    };
  }, [selectedWords]);


  const appendMoreStoryContent = (moreStoryContent) => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    const updatedContent = `${currentContent}${moreStoryContent}`;
    editor.commands.setContent(updatedContent);
    toast.success("Content added from moreStory");
  };
  
  const replaceSelectedWords = (newContent) => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    const oldText = selectedWords.join(' ');
    const updatedContent = currentContent.replace(new RegExp(oldText, 'g'), newContent);
    editor.commands.setContent(updatedContent);
    toast.success('Content replaced successfully');
  };

  return (
    <div className="writerEditor">
      <MenuBar editor={editor} content={content} choosenWord={choosenWord} setChoosenWord={setChoosenWord} />
      <div className="editorContentArea">
        <EditorContent editor={editor} onDoubleClick={handleSelectedWord} />
        <img src={content?.chapterImage ? content?.chapterImage : image} className='editorImg' />
      </div>
    </div>
  )
}

export default WriterEditor