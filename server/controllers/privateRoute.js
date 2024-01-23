import OpenAI from 'openai'
import UserStory from '../models/UsersStory.js'
import UserModel from '../models/User.js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
import { v4 as uuidv4 } from 'uuid';
//import { firebaseConfig } from '../utils/serviceAccountKey.js'
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

    await uploadBytes(storageRef, imageBlob)
    const url = await getDownloadURL(storageRef);
    console.log('URL FOM', url)

    return url
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error)
    throw error
  }
}


export async function createStory(req, res){
    const {title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded} = req.body
    
    try {
      console.log(title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded)
      const inkNeeded = numberOfSeries * 40
      if(!title || !desc || !genreValue || !language || !totalInkNeeded || !numberOfSeries || !userEmail || !ending ){
        return res.status(400).json({ success: false, data: 'Please fill all neccessary fields'})
      }
      
      const user = await UserModel.findOne({ email: userEmail })

      if(!user){
        return res.status(404).json({ success: false, data: 'Invalid User'})
      }

      if(inkNeeded > user.totalCredit){
        return res.status(401).json({ success: false, data: 'Insufficient Ink credit'})
      }
      const response = await openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Write a Story based on this title: ${title} and description; ${desc} in ${language} langauage the story should be in this type of genre: ${genreValue} ${mimicAuthor ? `and mimic the writting style of ${mimicAuthor}` : ''} the story should have ${numberOfSeries} number of chapters, each chapter should have a title, and the entire story should have this ending style ${ending}. Each chapter of the story you generate should be lenghty in terms of number of words and be creative, spice up the story. Also from the entire story you generate give it a nice story give title`,
          temperature: 0.9,
          max_tokens: 950
      })
      //console.log(response)
      console.log('STORY>>', response.choices[0].text)
      const genertedStory = response.choices[0].text

      //get the title from generated story
      const titleMatch = genertedStory.match(/Title: (.+?)\n/);
      const extractedTitle = titleMatch ? titleMatch[1] : '';
      
      //get each chapters from the generated story
      const chapterRegex = /Chapter (\w+): ([^\n]+)\n([\s\S]*?)(?=(Chapter (\w+):|$))/g;
      //const chapterRegex = /Chapter (\d+)([\s\S]*?)(?=(Chapter \d+|$))/g;
      const storyMatches = [...genertedStory.matchAll(chapterRegex)];
  
      const storyArray = storyMatches.map((match, index) => ({
        chapterTitle: match[2].trim(),
        chapterContent: match[3].trim(),
        chapterNumber: `Chapter ${index + 1}`,
      }));

      //FOR DALL_E_3
      /**
       * 
      const imageRes = await openai.images.generate({
        model: "dall-e-3",
        prompt: `based on this title: ${extractedTitle} and description: ${desc} generate an image`,
        n: 1,
        size: "1792x1024",
        response_format: 'b64_json',
        style: 'vivid'
      })
       */

      //FOR DALL_E-2
      const imageRes = await openai.images.generate({
        model: "dall-e-2",
        prompt: `based on this title: ${extractedTitle} and description: ${desc} generate an image`,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json',
      })
      let storyImage = '';

      if (imageRes.data.length > 0) {
        console.log('base_64 of image', imageRes.data[0].b64_json)
        storyImage = await createFirebaseStorageUrl(imageRes.data[0].b64_json, 'story-img')
        console.log('storyImage>>',storyImage)
      }

      //FOR DALL_E_3
      /**
       * 
      const coverImageRes = await openai.images.generate({
        model: "dall-e-3",
        prompt: `based on this title: ${extractedTitle} generate a cover image for it that can be used in the background`,
        n: 1,
        size: "1792x1024",
        response_format: 'b64_json',
        style: 'vivid'
      })
       */

      //FOR DALL_E_2
      const coverImageRes = await openai.images.generate({
        model: "dall-e-2",
        prompt: `based on this title: ${extractedTitle} generate a cover image for it that can be used in the background`,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json',
      })
      let coverImage = '';
      if (coverImageRes.data.length > 0) {
        console.log('base_64 of cover image', coverImageRes.data[0].b64_json)
        coverImage = await createFirebaseStorageUrl(coverImageRes.data[0].b64_json, 'cover-img');
        console.log('coverImage>>', coverImage)
      }


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
          storyLangauage: language,
          endingStyle: ending,
      })
  
      await newStory.save()
      console.log('STORY SAVED>>',newStory)

      //calculate user total ink need
      user.totalCreditUsed += inkNeeded
      await user.save()
      console.log('USER INK DEDUCTED>>', user.totalCreditUsed)
  
      res.status(201).json({ success: true, data: genertedStory})
  }  catch (error) {
        console.log('ERROR CREATING STORY', error)
        res.status(500).json({ success: false, data: 'Failed to Create Story'})
    }
}

export async function getUserStories(req, res){
  const { id } = req.params
  console.log(id)
  console.log('working userStories')
  try {
    const user = await UserModel.findOne({ _id: id })
    if(!user){
      return res.status(404).json({ success: false, data: 'Invalid user'})
    }

    const storiesData = await UserStory.find({ email: user.email })

    console.log(storiesData)
    res.status(200).json({ success: true, data: storiesData })
    
  } catch (error) {
    console.log('ERROR GETTING ALL USER STORIES', error)
    res.status(500).json({ success: false, data: 'failed to get stories'})
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
  const { id } = req.params
  try {
    const story = await UserStory.findById({ id })
    if(!story){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }
    story.privateStory = false
    await story.save()

    res.status(200).json({ success: true, data: 'Story Updated'})
  } catch (error) {
    console.log('ERROR HANDLING PRIVATE STORY', error)
    res.status(500).json({ success: false, data: 'failed to get stories'})
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
    if(!storyDesc){
      return res.status(404).json({ success: false, data: 'Story not Found'})
    }

    const description = storyDesc.storyDesc

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `based on this desc ${description} rewrite the description a new and improve way. note it is a description so it should be short and nice. not too short`,
      temperature: 0.9,
      max_tokens: 200
    })

    const newDesc = response.choices[0].text.trim()
    storyDesc.storyDesc = newDesc
    await storyDesc.save()
    console.log('OLD>>>',description)
    console.log('NEW>>>',newDesc)

    res.status(201).json({ success: true, data: 'Description created'})
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
    console.log('OLD>>>',desc)
    console.log('NEW>>>',storyDesc.storyDesc)

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
    if(!oldStory){
      return res.status(404).json({ success: false, data: 'Story not Found'})
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

    res.status(201).json({ success: true, data: 'New story generated' })
  } catch (error) {
    console.log('ERROR RECREATING STORY', error)
    res.status(500).json({ success: false, data: 'Failed to recreate story'})
  }
}