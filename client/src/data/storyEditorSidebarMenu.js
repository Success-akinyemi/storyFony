import BookImg from '../assets/book.png'
import ContentImg from '../assets/content.png'
import MicImg from '../assets/mic.png'
import FileImg from '../assets/file.png'

import BookImgDark from '../assets/bookDark.png'
import ContentImgDark from '../assets/contentDark.png'
import MicImgDark from '../assets/micDark.png'
import FileImgDark from '../assets/fileDark.png'

export const storyEditorSidebarMenu = [
    {
        key: 1,
        text: 'Book Summary',
        img: BookImg,
        imgDark: BookImgDark,
    },
    {
        key: 2,
        text: 'Table of content',
        img: ContentImg,
        imgDark: ContentImgDark,
    },
    {
        key: 3,
        text: 'AI voice reader',
        img: MicImg,
        imgDark: MicImgDark,
    },
    {
        key: 4,
        text: 'Story Cover Image',
        img: FileImg,
        imgDark: FileImgDark,
    }
]