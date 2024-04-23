//import OpenAI from 'openai'
import UserStory from '../models/UsersStory.js'
import UserModel from '../models/User.js'
//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
import pdfkit from 'pdfkit'
import fs from 'fs';
import { promises as fsPromises } from 'fs';
const { writeFile, unlink } = fsPromises;
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
//import { firebaseConfig } from '../utils/serviceAccountKey.js'
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import path from 'path'

const firebaseConfig = {
  "apiKey": process.env.FIREBASE_API_KEY,
  "authDomain": "success-clone.firebaseapp.com",
  "databaseURL": process.env.FIREBASE_BD_URI,
  "projectId": "success-clone",
  "storageBucket": "success-clone.appspot.com",
  "messagingSenderId": "189431815177",
  "appId": "1:189431815177:web:15ed22c60195f1d3982cd8",
  "measurementId": "G-0SY60YP3G9"
};
 
 const app = initializeApp(firebaseConfig);
 const storage = getStorage(app)


const createFirebaseStorageUrl = async (imageData, imageName) => {
  try {
    const storageRef = ref(storage, imageName);
    const uniqueName = `${imageName}-${uuidv4()}.jpg`
    const imageBlob = await fetch(`data:image/jpeg;base64,${imageData}`).then((response) => response.blob());

    await uploadBytes(storageRef, imageBlob, { name: uniqueName })
    const url = await getDownloadURL(storageRef);
    console.log('URL FOM', url)

    return url
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error)
    throw error
  }
}


export async function createStory(req, res) {
  const {
    title,
    desc,
    motive,
    genreValue,
    ending,
    mimicAuthor,
    numberOfSeries,
    language,
    userEmail,
    totalInkNeeded,
  } = req.body;

  let genertedStory;
  let storyImage = '';
  let coverImage = '';
  const user = await UserModel.findOne({ email: userEmail });

  const inkNeeded = numberOfSeries * parseInt(process.env.FONY_INK_COST_PER_CHAPTER, 10);
  try {
    const commonLogic = async (language, titleMatchRegex, chapterRegex, heading) => {

      //if (!title || !desc || !genreValue || !language || !totalInkNeeded || !numberOfSeries || !userEmail || !ending) {
      //  return res.status(400).json({ success: false, data: 'Please fill all necessary fields' });
      //}

      const user = await UserModel.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ success: false, data: 'Invalid User' });
      }
      
      if(user?.planName === 'basic' && numberOfSeries > 15){
        return res.status(400).json({ success: false, data: 'Max number of Chapter for story is 15 for basic plan' });
      }

      if(user?.planName === 'standard' && numberOfSeries > 30){
        return res.status(400).json({ success: false, data: 'Max number of Chapter for story is 30 for standard plan' });
      }


      if (inkNeeded > user.totalCreditBalance) {
        return res.status(402).json({ success: false, data: 'Insufficient Ink credit' });
      }

      const openai = req.openai;

      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        //prompt: `Write a Story based on this title: ${title} and description; ${desc}. the entire story must be in ${language} language the story should be in this type of genre: ${genreValue} ${mimicAuthor ? `and mimic the writing style of ${mimicAuthor}` : ''} the story should have ${numberOfSeries} number of chapters, each new chapter should have a chapter title and the word title only should be in english, and the entire story should have this ending style ${ending}. Each chapter of the story you generate should be lengthy in terms of the number of words and be creative, spice up the story. Also give the entire story a story title the word title should be in english. except fot the word 'Chapter' it must be in english for every langauage. NOTE THE WORD 'Chapter' FOR EACH NEW CHAPTER MUST BE IN ENGLISH REGARDLESS OF THE STORY LANGUAGE. NOTE THE WORD 'Title' FOR THE ENTIRE STORY TITLE MUST BE IN ENGLISH REGARDLESS OF THE STORY LANGUAGE`,
        //prompt: `Generate a captivating story based on the title: ${title} and description: ${desc}. The entire story must be in ${language} language and must fall under the genre: ${genreValue}. ${mimicAuthor ? `mimic the writing style of ${mimicAuthor}` : ''}. The story should consist of ${numberOfSeries} chapters, each with a Chapter title. The word 'Chapter' for each new Chapter to signify the start of a new Chapter story must be in English language, regardless of the story language. Additionally, ensure that the entire story has a title, with the word 'Title' in English language. End the story in the style: ${ending}`,
        prompt: `Craft an engaging story titled '${title}', inspired by the description: '${desc}'. This narrative must unfold in ${language} language, within the ${genreValue} genre. ${mimicAuthor ? `If applicable, mimic the writing style of ${mimicAuthor}` : ''}. The tale should span ${numberOfSeries} chapters, with each chapter beginning with the word 'Chapter' in English to denote its commencement. Additionally, ensure the entire story has an English-language title. Conclude the story in the following style: '${ending}'`,
        temperature: 0.9,
        max_tokens: 950,
      });
      console.log('RAW RESPONSE', response)

      genertedStory = response.choices[0].text;
      const titleMatch = genertedStory.match(titleMatchRegex);
      const extractedTitle = titleMatch ? titleMatch[1] : '';

      const imageRes = await openai.images.generate({
        model: "dall-e-2",
        prompt: `based on this title: ${extractedTitle} and description: ${desc} generate an image`,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json',
      });

      
      if (imageRes.data.length > 0) {
        const uniqueName = `image-${uuidv4()}.jpg`;
        storyImage = await createFirebaseStorageUrl(imageRes.data[0].b64_json, `${uniqueName}`);
      }

      const coverImageRes = await openai.images.generate({
        model: "dall-e-2",
        prompt: `based on this title: ${extractedTitle} generate a cover image for it that can be used in the background`,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json',
      });

      
      if (coverImageRes.data.length > 0) {
        const uniqueName = `image-${uuidv4()}.jpg`;
        coverImage = await createFirebaseStorageUrl(coverImageRes.data[0].b64_json, `${uniqueName}`);
      }

      const storyArray = processGeneratedStory(genertedStory, storyImage, numberOfSeries, chapterRegex, heading);

      const newStory = new UserStory({
        story: storyArray,
        email: userEmail,
        author: `${user.name}`,
        motive: motive,
        authorPenName: user.penName,
        authorImg: user.profileImg,
        genre: genreValue,
        userTitle: title,
        storyTitle: extractedTitle,
        storyImage: storyImage,
        coverImage: coverImage,
        storyDesc: desc,
        storyLangauage: language.toLowerCase(),
        endingStyle: ending,
      });

      await newStory.save();

      user.totalCreditUsed += inkNeeded;
      user.totalCreditBalance -= inkNeeded;
      await user.save();

      res.status(201).json({ success: true, data: genertedStory, user: { success: true, data: user } });
    };

    if (language === 'English') {
      await commonLogic(language, /Title: (.+?)\n/, /Chapter (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\w+):|$))/g, 'Chapter');
    } 
    //else if (language === 'French') {
    //  await commonLogic(language, /Titre: (.+?)\n/, /Chapitre (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapitre (\w+):|$))/g, 'Chapitre');
    //}
    //else if (language === 'Spanish') {
    //  await commonLogic(language, /Título: (.+?)\n/, /Capítulo (\w+): ([^\n]+)\n([\s\S]*?)(?=(Capítulo (\w+):|$))/g, 'Capítulo');
    //} 
    //else if (language === 'Chinese') {
    //  await commonLogic(language, /爱在这个温馨的故事中没有界限。跟随两个人的旅程，他们携手应对恋爱中的波折，从初吻的蝶变到真正的热情。当他们的爱情故事展开时，秘密、挑战和意外的转折考验着他们的感情。\n([\s\S]+?)((第一章)|(第二章)|(第三章))：/, /(第一章|第二章|第三章)：[\s\S]+?(\n\n|$)/g, '第一章');
    //} 
    //else if (language === 'Swahili') {
    //  await commonLogic(language, /Title: (.+?)\n/, /Sura ya (\w+): ([^\n]+)\n([\s\S]*?)(?=(Sura ya (\w+):|$))/g, 'Sura ya');
    //}
    else {
      await commonLogic(language, /Title: (.+?)\n/, /Chapter (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\w+):|$))/g, 'Chapter');
    }
  } catch (error) {
    console.log('ERROR CREATING STORY', error);
    res.status(500).json({ success: false, data: 'Failed to Create Story' });
  }
}

const processGeneratedStory = (generatedStory, storyImage, numberOfSeries, chapterRegex, heading) => {
  const storyMatches = [...generatedStory.matchAll(chapterRegex)];

  const storyArray = storyMatches.map((match, index) => ({
    chapterTitle: match[2].trim(),
    chapterContent: match[3].trim(),
    chapterNumber: `${heading} ${index + 1}`,
    chapterImage: storyImage,
  }));

  return storyArray;
}

export async function getUserStories(req, res){
  const { id } = req.params
  console.log(id)
  console.log('working userStories', id)
  try {
    const user = await UserModel.findOne({ _id: id })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    const storiesData = await UserStory.find({ email: user.email })

    //console.log(storiesData)
    res.status(200).json({ success: true, data: storiesData })
    
  } catch (error) {
    console.log('ERROR GETTING ALL USER STORIES', error)
    res.status(500).json({ success: false, data: 'failed to get stories'})
  }
}

export async function getLikedUserStories(req, res){
  const { id } = req.params
  try {
    const user = await UserModel.findOne({ _id: id })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    const likedStories = await UserStory.find({ likes: user._id })

    console.log('LIKED STORIES', likedStories)
    res.status(200).json({ success: true, data: likedStories });
  } catch (error) {
    console.log('COULD NOT GET USER LIKED STORIES')
    res.status(500).json({ success: false, data: 'Could not get Liked stories'})
  }
}

export async function getUserStory(req, res){
  const { id, storyId } = req.params
  console.log('IDs',id, storyId)
  try {
    const user = await UserModel.findOne({ _id: id })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    const storyData = await UserStory.findOne({ _id: storyId})
    if(!storyData){
      return res.status(404).json({ success: false, data: 'Story not found'})
    }


    res.status(200).json({ success: true, data: storyData })
    
  } catch (error) {
    console.log('ERROR GETTING USER STORY', error)
    res.status(500).json({ success: false, data: 'failed to get stories'})
  }
}

export async function deleteStory(req, res){
  const { storyId, userId } = req.body
  try {
    if(req.user.id !== userId){
      return res.status(403).json({ success: false, data: 'you can only delete your story' })
    }
    const story = await UserStory.find({ _id: storyId })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story not found'})
    }
    const deleteUserStory = await UserStory.findOneAndDelete({ _id: storyId })
    
    res.status(200).json({ success: true, data: 'Story deleted successful'})
  } catch (error) {
    console.log('UNABLE TO DELETE STORY', error)
    res.status(500).json({ success: false, data: 'Unable to delete story' })
  }
}

export async function getUserStoryEdit(req, res){
  const { id, storyId } = req.params
  console.log('IDs',id, storyId)
  try {
    const user = await UserModel.findOne({ _id: id })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    if(req.user.id !== id){
      return res.status(401).json({ success: false, data: 'You can only edit your story'})
    }

    const storyData = await UserStory.findOne({ _id: storyId})
    if(!storyData){
      return res.status(404).json({ success: false, data: 'Story not found'})
    }


    res.status(200).json({ success: true, data: storyData })
    
  } catch (error) {
    console.log('ERROR GETTING USER STORY', error)
    res.status(500).json({ success: false, data: 'failed to get stories'})
  }
}

//handle both making story both  private and public
export async function handlePrivateStory(req, res){
  const { id, userId } = req.body
  console.log('BD', id)
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }
    const story = await UserStory.findById({ _id: id })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    if(story.privateStory === false){
      story.privateStory = true
      await story.save()
      return res.status(200).json({ success: true, data: 'Story Made Private'})
    }

    if(story.privateStory === true){
      story.privateStory = false
      await story.save()
      return res.status(200).json({ success: true, data: 'Story Made Public'})
    }

  } catch (error) {
    console.log('ERROR HANDLING PRIVATE STORY', error)
    res.status(500).json({ success: false, data: 'failed to update story'})
  }
}

//handle both making story availble to community or not
export async function handlePublishedToCommunity(req, res){
  const { id, userId } = req.body
  console.log('BD', id)
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }
    const story = await UserStory.findById({ _id: id })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    if(story.PublishedToCommunity === false){
      story.PublishedToCommunity = true
      await story.save()
      return res.status(200).json({ success: true, data: 'Story Published To Community'})
    }

    if(story.PublishedToCommunity === true){
      story.PublishedToCommunity = false
      await story.save()
      return res.status(200).json({ success: true, data: 'Story Not Published To Community'})
    }

  } catch (error) {
    console.log('ERROR HANDLING PRIVATE STORY', error)
    res.status(500).json({ success: false, data: 'failed to update story'})
  }
}

//handle new story desc
export async function generateNewStoryDesc(req, res){
  const {desc, storyId, userId} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const storyDesc = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    if(!storyDesc){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    if(parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10) > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const description = storyDesc.storyDesc

    const openai = req.openai;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `based on this desc ${description} rewrite the description a new and improve way. note it is a description so it should be short and nice. not too short`,
      temperature: 0.9,
      max_tokens: 100
    })

    const newDesc = response.choices[0].text.trim()
    storyDesc.storyDesc = newDesc
    await storyDesc.save()

        //debit user
        user.totalCreditUsed += parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10)
        user.totalCreditBalance -= parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10);
        await user.save()

    res.status(201).json({ success: true, data: 'Description created', user: {success: true, data: user}})
  } catch (error) {
    console.log('FAILED TO GENERATE NEW DESCRIPTION>>>', error)
    res.status(500).json({ success: false, data: 'failed to generate story description'})
  }
}

// save story Description
export async function saveStoryDesc(req, res){
  const {desc, storyId, userId} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const storyDesc = await UserStory.findById({ _id: storyId })
    if(!storyDesc){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    if(!desc){
      return res.status(404).json({ success: false, data: 'Story Description cannot be empty'})
    }

    storyDesc.storyDesc = desc
    await storyDesc.save()


    res.status(201).json({ success: true, data: 'Description Saved'})
  } catch (error) {
    console.log('FAILED TO GENERATE NEW DESCRIPTION>>>', error)
    res.status(500).json({ success: false, data: 'failed to generate story description'})
  }
}

//Recreate a already existing story for a user
export async function recreateStory (req, res){
  const { storyId, userId } = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const oldStory = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    
    const openai = req.openai;

    const inkNeeded = oldStory.story.length * parseInt(process.env.FONY_INK_COST_PER_CHAPTER, 10)
    if(!oldStory){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    if(inkNeeded > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Rewrite this Story ${oldStory.story} better based on this title: ${oldStory.userTitle} and description; ${oldStory.storyDesc} in ${oldStory.storyLangauage} langauage the story should be in this type of genre: ${oldStory.genre} the story should have ${oldStory.story.length} number of chapters. ${oldStory.endingStyle ? `the story should have this ending style ${oldStory.endingStyle}` : '' }. Also from the story give a good story title. each chapter you generate should be lenghty in terms of number of words be creative and spice up the story`,
      temperature: 0.9,
      max_tokens: 950
    })

    //console.log(response.choices[0].text)
    const newGeneratedStory = response.choices[0].text

    //get each chapters from the generated story
    const chapterRegex = /Chapter (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\w+):|$))/g;
    //const chapterRegex = /Chapter (\d+)([\s\S]*?)(?=(Chapter \d+|$))/g;
    const storyMatches = [...newGeneratedStory.matchAll(chapterRegex)];
  
      const storyArray = storyMatches.map((match, index) => ({
        chapterTitle: match[2].trim(),
        chapterContent: match[3].trim(),
        chapterNumber: `Chapter ${index + 1}`,
      }));

      //console.log('OLD STORY', oldStory.story)

      oldStory.story = storyArray
      oldStory.save()
      //console.log('NEW STORY', oldStory.story)

      //debit user
      user.totalCreditUsed += inkNeeded
      user.totalCreditBalance -= inkNeeded
      await user.save()

    res.status(201).json({ success: true, data: 'New story generated', user: {success: true, data: user} })
  } catch (error) {
    console.log('ERROR RECREATING STORY', error)
    res.status(500).json({ success: false, data: 'Failed to recreate story',})
  }
}

//Rewrite a chapter for a existing story for a user
export async function rewriteChapter(req, res){
  const {text, userId, storyId, chapterId} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    const openai = req.openai
    
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    } 

    if(parseInt(process.env.FONY_INK_COST_PER_CHAPTER, 10) > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const chapterIndex  = story.story.findIndex((chapter) => chapter ._id.toString() === chapterId);
    if (chapterIndex  !== -1) {
      const chapter = story.story[chapterIndex];
      console.log('OLD CHAPTER>>', chapter.chapterContent);

      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: `Rewrite this Chapter text in a more better way: ${chapter.chapterContent}. it is a part of a story so be careful when rewriting it make the new text better at the same maintain the genre styling and writing style of the former so as to maintain the flow with other chapters. the generated text should be lenghty enough. also it must be in this language ${story.storyLangauage}`,
        temperature: 0.9,
        max_tokens: 950
      })

      const newGeneratedStory = response.choices[0].text
      console.log('NEW CHAPTER CONTENT', newGeneratedStory)
      
      // Update the chapter content
      chapter.chapterContent = newGeneratedStory;
      await story.save()

      //debit user
      user.totalCreditUsed += parseInt(process.env.FONY_INK_COST_PER_CHAPTER, 10);
      user.totalCreditBalance -= parseInt(process.env.FONY_INK_COST_PER_CHAPTER, 10);
      await user.save()

      res.status(201).json({success: true, data:'Chapter recreated', user: {success: true, data: user} })
    
    } else {
      console.log('Chapter not found');
      return res.status(404).json({success: false, data: 'This chapter does not exist'})
    }


  } catch (error) {
    console.log('ERROR REWRITING CHAPTER', error)
    res.status(500).json({success: false, data: 'Failed to rewrite chapter'})
  }
}

//generate chapter image
export async function generateChapterImage(req, res){
  const {text, userId, storyId, chapterId} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    } 

    if(parseInt(process.env.FONY_INK_COST_PER_IMAGE, 10) > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const chapterIndex  = story.story.findIndex((chapter) => chapter._id.toString() === chapterId);
    const openai = req.openai

    if (chapterIndex  !== -1) {
      const chapter = story.story[chapterIndex];
      //console.log("CHAPTER", chapter)
      //FOR DALL_E_3
        /**
         * 
        const imageRes = await openai.images.generate({
          model: "dall-e-3",
          prompt: `based on this chapter title: ${story.chapterTitle ? story.chapterTitle : story.userTitle} from a story, the entire story summary is this: ${story.desc} generate an image. the image must tell the story center around this chapter title: ${chapter.chapterTitle}`,
          n: 1,
          size: "1792x1024",
          response_format: 'b64_json',
          style: 'vivid'
        })
         */

        //FOR DALL_E-2
        const imageRes = await openai.images.generate({
          model: "dall-e-2",
          prompt: `based on this chapter title: ${story.chapterTitle ? story.chapterTitle : story.userTitle} from a story, the entire story summary is this: ${story.desc} generate an image. the image must tell the story center around this chapter title: ${chapter.chapterTitle}`,
          n: 1,
          size: "1024x1024",
          response_format: 'b64_json',
        })
        let storyImage = '';
  
        if (imageRes.data.length > 0) {
          //console.log('base_64 of image', imageRes.data[0].b64_json)
          const uniqueName = `image-${uuidv4()}.jpg`
          storyImage = await createFirebaseStorageUrl(imageRes.data[0].b64_json, `${uniqueName}`)
          console.log('storyImage>>',storyImage)

          chapter.chapterImage = storyImage
          await story.save()

          //debit user
          user.totalCreditUsed += parseInt(process.env.FONY_INK_COST_PER_IMAGE, 10);
          user.totalCreditBalance -= parseInt(process.env.FONY_INK_COST_PER_IMAGE, 10);
          await user.save()
          res.status(201).json({success: true, data:'Image generated', user: {success: true, data: user} })
        }

        
    } else {
      console.log('Chapter not found');
      return res.status(404).json({success: false, data: 'This chapter does not exist'})
    }
  } catch (error) {
    console.log('ERROR CREATING CHAPTER IMAGE', error)
    res.status(500).json({ success: false, data: 'Failed to create image for chapter'})
  }
}

//save edited story chapter content
export async function updateStoryChapterContent(req, res){
  const {userId, storyId, chapterId, currentChapterContent} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    } 

    const chapterIndex  = story.story.findIndex((chapter) => chapter._id.toString() === chapterId);
    
    if (chapterIndex  !== -1) {
      const chapter = story.story[chapterIndex];
      //console.log('Chapter', chapter)
      //console.log('TEXT>>', currentChapterContent)

      const editedContent = JSON.stringify(currentChapterContent)
      chapter.chapterContent = editedContent
      await story.save()

      res.status(200).json({ success: true, data: 'story created' })
    } else {
      console.log('Chapter not found');
      return res.status(404).json({success: false, data: 'This chapter does not exist'})
    }

  } catch (error) {
    console.log('FAILED TO UPDATE STORY CHAPTER CONTENT', error)
    res.status(500).json({ success: false, data: 'Failed to save story chapter'})
  }
}

export async function generateCoverStoryImage(req, res){
  const { desc, storyId, userId } = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    const openai = req.openai                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    }

    if(parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10) > user.totalCreditBalance ){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    if(story){
      //FOR DALL_E_3
        /**
         * 
        const imageRes = await openai.images.generate({
          model: "dall-e-3",
          prompt: `based on this chapter title: ${story.chapterTitle ? story.chapterTitle : story.userTitle} from a story, the entire story summary is this: ${story.desc} generate an image. the image should tell the story given to you as it sholud be centered based on the story`,
          n: 1,
          size: "1792x1024",
          response_format: 'b64_json',
          style: 'vivid'
        })
         */

        //FOR DALL_E-2
        const imageRes = await openai.images.generate({
          model: "dall-e-2",
          prompt: `based on this chapter title: ${story.chapterTitle ? story.chapterTitle : story.userTitle} from a story, the entire story summary is this: ${story.desc} generate an image. the image should tell the story given to you as it sholud be centered based on the story`,
          n: 1,
          size: "1024x1024",
          response_format: 'b64_json',
        })
        let storyImage = '';
  
        if (imageRes.data.length > 0) {
          //console.log('base_64 of image', imageRes.data[0].b64_json)
          const uniqueName = `image-${uuidv4()}.jpg`
          storyImage = await createFirebaseStorageUrl(imageRes.data[0].b64_json, `${uniqueName}`)
          console.log('storyImage>>',storyImage)

          story.coverImage = storyImage
          await story.save()

          //console.log('INK BEFORE,',user.totalCredit)
          user.totalCreditUsed += parseInt(process.env.FONY_INK_COST_PER_IMAGE, 10);
          user.totalCreditBalance -= parseInt(process.env.FONY_INK_COST_PER_IMAGE, 10);
          await user.save()
          //console.log('INK AFTER,',user.totalCredit)
          res.status(201).json({success: true, data:'Cover image generated', user: {success: true, data: user} })
        }
    }
    
  } catch (error) {
    console.log('ERROR GENERATING NEW COVER IMAGE FOR STORY', error)
    res.status(500).json('Unable to generate cover image for story')
  }
}

export async function uploadCoverImg(req, res){
  const { coverImg, userId, storyId } = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    }

    if(story){
      story.coverImage = coverImg
      await story.save()
    }
    
    res.status(201).json({ success: true, data: story })
  } catch (error) {
    console.log('FAILED TO SAVE STORY IMAGE.', error)
    res.status(500).json({ success: false, data:'Failed to save cover image.'})
  }
}

export async function addNewChapters(req, res){
  const {storyId, userId, newChapter, chapterImg} = req.body
  try {
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only edit your story'})
    }

    const story = await UserStory.findById({ _id: storyId })
    const user = await UserModel.findById({ _id: userId })
    const openai = req.openai
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    }

    const inkNeeded = newChapter * parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10)

    if(inkNeeded > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const lastChapterStory = story.story[story.story.length - 1]

    if(story){
      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: `Based on this story description ${story.desc}. the last chapter of the story is this: ${lastChapterStory?.chapterContent ? lastChapterStory?.chapterContent : 'no content yet so start from begining'} and it is chapter ${story?.story?.length ? story?.story?.length : 'the new story start be chapter 1'}. generate ${newChapter} more chapters to be added to the story it will continue from where the last chapter stops. the new generated chapters must blend with the existng story. also give each chapter a befitting title. also the story must be in ${story.storyLangauage} except fot the word 'Chapter' it must be in english for every langauage. NOTE THE WORD 'Chapter' FOR EACH NEW CHAPTER MUST BE IN ENGLISH REGARDLESS OF THE STORY LANGUAGE`,
        temperature: 0.9,
        max_tokens: 950
    })
    const genertedStory = response.choices[0].text
    console.log('GENSTORY', response)
    //get each chapters from the generated story
    //let chapterRegex
    const chapterRegex = /Chapter (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\w+):|$))/g;
    
    //const chapterRegex = /Chapter (\d+)([\s\S]*?)(?=(Chapter \d+|$))/g;
/**

if (story.storyLangauage === 'english'){
  chapterRegex = /(?:Title: (.+?)\n)?|Chapter (\d+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\d+):|$))/g;
} else if (story.storyLangauage === 'french') {
  chapterRegex = /(?:Titre: (.+?)\n)?|Chapitre (\d+): ([^\n]+)\n([\s\S]*?)(?=(Chapitre (\d+):|$))/g;
} else {
  chapterRegex = /(?:Title: (.+?)\n)?|Chapter (\d+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\d+):|$))/g;
}
 */
    
    const storyMatches = [...genertedStory?.matchAll(chapterRegex)];

    const startingChapterNumber = parseInt(storyMatches[0][1], 10);

    const storyArray = storyMatches.map((match, index) => {
      const newChapterNumber = startingChapterNumber + index;
      
      return {
        chapterTitle: match[2].trim(),
        chapterContent: match[3].trim(),
        chapterNumber: `Chapter ${newChapterNumber}`,
        chapterImg: story.storyImage
      };
    });

    story.story.push(...storyArray)
    user.totalCreditEverUsed += inkNeeded;
    user.totalCreditBalance -= inkNeeded;
    await story.save()
    await user.save()

    
    res.status(201).json({ success: true, data: story, user: {success: true, data: user} })
  }
  } catch (error) {
    console.log('ERROR CREATING NEW CHAPTERS', error)
    res.status(500).json({success: false, data:'Failed to create story'})
  }
}

export async function likeStory(req, res){
  const { userId, storyId, plan } = req.body
  try {
    const story = await UserStory.findById(storyId)
    console.log('Story', story)
    const user = await UserModel.findById({ _id: userId })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story does not exist'})
    }
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    if(plan === 'add'){
      if(!story.likes.includes(user._id)){
        story.likes.push(user._id)
        await story.save()
      }

      return res.status(200).json({ success: true, data: story})
    }

    if(plan === 'remove'){
      const index = story.likes.indexOf(user._id)
      if(index !== -1){
        story.likes.splice(index, 1)
        await story.save()
      }

      return res.status(200).json({ success: true, data: story })
    }

  } catch (error) {
    console.log('FAILED TO LIKE STORY', error)
    res.status(500).json('unable to like story.')
  }
}

export async function generateAiDesc(req, res){
  const { userId, genreValue, title } = req.body
  try {
    const user = await UserModel.findById({ _id: userId })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }
    if(req.user.id !== userId){
      return res.status(404).json({ success: false, data: 'You can only work on your story'})
    }

    if(parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10) > user.totalCreditBalance){
      return res.status(402).json({ success: false, data: 'Insufficient Ink credit'})
    }

    const openai = req.openai;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `generate a captivating and intresting description for a story centered around ${genreValue} and ${title}. the description must be complete, and also the decription must be a public safe one`,
      temperature: 0.9,
      max_tokens: 90
    })
    //console.log('first', response)
    const genertedStory = response.choices[0].text

    //debit user
    user.totalCreditUsed += parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10);
    user.totalCreditBalance -= parseInt(process.env.FONY_INK_COST_PER_DESCRIPTION, 10);
    await user.save()

    res.status(201).json({ success: true, data: genertedStory,  user: {success: true, data: user} })
  } catch (error) {
    console.log('COULD NOT GENERATE AI DESCRIPTION', error)
    res.status(500).json('Could not generate')
  }
}

// Helper function to get the directory name from a URL
function getDirname(url) {
  return path.dirname(url.replace(/^file:[/]+/, ''));
}

// Create PDF
export async function generatePdf(req, res) {
  const { id, userId } = req.body;

  try {
    console.log('WORKING');
    const story = await UserStory.findById(id);

    if (!story) {
      return res.status(405).json({ success: false, data: 'Story not found' });
    }

    const doc = new pdfkit();
    const outputFileName = `${story.title ? story.title : story.userTitle}-${story.author}.pdf`;
    const outputFilePath = path.join(getDirname(import.meta.url), outputFileName);

    // Add Cover Image on the first page
    await downloadAndEmbedImage(doc, story.coverImage);

    // Add Title and author name on the next page
    doc.addPage();
    const titleText = `Title: ${story.title ? story.title : story.userTitle}`;
    const authorText = `Author: ${story.author}`;
    const centerX = doc.page.width / 2;
    const centerY = doc.page.height / 2;
    doc.fontSize(24).text(titleText, centerX, centerY - 20, { align: 'center' });
    doc.fontSize(16).text(authorText, centerX, centerY + 20, { align: 'center' });

    // Track current Y position
    let currentY = doc.y;

    // Add chapters
    for (const chapter of story.story) {
      // Add chapter content
      doc.addPage();
      doc.fontSize(20).text(chapter.chapterTitle, { align: 'center' });
      doc.fontSize(18).text(chapter.chapterNumber, { align: 'center' });
      doc.fontSize(16).text(chapter.chapterContent);

      // Embed chapter image on a fresh page
      doc.addPage();
      await downloadAndEmbedImage(doc, chapter.chapterImage);

      // Track current Y position for the next chapter
      currentY = doc.y;
    }

    // Add story image on the last page
    doc.addPage();
    await downloadAndEmbedImage(doc, story.storyImage);

    // Add promotion text on a separate page
    doc.addPage().fontSize(16).text('Made and Produced by Story Generator', { align: 'center' });
    doc.text(`Visit ${process.env.MAIL_WEBSITE_LINK}`, { align: 'center' });

    // Save PDF to server file
    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

    // End the document
    doc.end();

    // Wait for the stream to finish writing
    stream.on('finish', () => {
      try {
        // Read the file content synchronously
        const pdfBuffer = fs.readFileSync(outputFilePath);
    
        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
    
        // Send the PDF content in the response
        res.send(pdfBuffer);
    
        // Optionally, delete the file after sending
        fs.unlinkSync(outputFilePath);
        console.log('PDF sent to the client successfully');
      } catch (readFileError) {
        console.error('Error reading PDF file:', readFileError);
        res.status(500).json({ success: false, data: 'Could not read the PDF file' });
      }
    });
  } catch (error) {
    console.error('COULD NOT GENERATE STORY', error);
    res.status(500).json({ success: false, data: 'Could not create the PDF' });
  }
}

const axiosConfig = {
  responseType: 'arraybuffer',
  baseURL: process.env.SERVER_URL, // Update with your server URL
};

// Function to download and embed image into PDF
async function downloadAndEmbedImage(doc, imageUrl, yPos = doc.y) {
  try {
    console.log('WORK');
    const imageResponse = await axios.get(imageUrl, axiosConfig);
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Embed the image into the PDF document at yPos
    doc.image(imageBuffer, { width: 300, y: yPos });
  } catch (error) {
    console.error('Error downloading and embedding image:', error);
    // Handle error accordingly
    throw error; // Rethrow error to be caught by the caller
  }
}

//generate audio for story
export async function generateAudio(req, res){
  const {userId, storyId, userVoice} = req.body
  console.log(userId, storyId, userVoice)
  try {
    const user = await UserModel.findById({ _id: userId })
    const story = await UserStory.findById({ _id: storyId })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid User' })
    }

    if(!story){
      return res.status(404).json({ success: false, data: 'Invalid Story' })
    }

    const storyData = story.story
 

    //test for one chapter
    const testOneChapter = storyData[0]
    console.log('DATA', testOneChapter)

    let concatenatedText = '';
    if (testOneChapter) {
      concatenatedText = `${testOneChapter.chapterNumber}: ${testOneChapter.chapterTitle}\n${testOneChapter.chapterContent}\n`;
    }

/**
 * 
if (testOneChapter.length === 1) {
  const chapter = testOneChapter[0];
  concatenatedText = `${chapter.chapterNumber}: ${chapter.chapterTitle}\n${chapter.chapterContent}\n`;
} else {
  concatenatedText = testOneChapter
    .map(
      (chapter) =>
        `${chapter.chapterNumber}: ${chapter.chapterTitle}\n${chapter.chapterContent}\n`
    ).join('\n');
}
 */

console.log(concatenatedText);

 
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: userVoice,
      input: concatenatedText
    })
    console.log('RES', response)

    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);

    response.body.pipe(res);

    
  } catch (error) {
    console.log('ERROR GETTING AUDIO OF STORY', error)
    res.status(500).json({ success: false, data: 'Failed to generate audio'})
  }
}

//get synonym Word
export async function synonymWord(req, res){
  const { word } = req.body
  try {
    if(!word){
      return res.status(404).json({ success: false, data: 'Please highight a word'})
    }
    console.log(word)
    const openai = req.openai;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `based on this word: ${word} give the most compactable synonym word `,
      temperature: 0.9,
      max_tokens: 100
    })

    console.log(response.choices[0].text.trim())
    const newWord = response.choices[0].text.trim()

    res.status(201).json({ success: true, data: newWord})
  } catch (error) {
    console.log('UNABLE TO GET SYNONYM WORD', error)
    res.status(500).json({ success: false, data: 'Unable to get synonmy word'})
  }
}