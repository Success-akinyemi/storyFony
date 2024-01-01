import OpenAI from 'openai'
import UserStory from '../models/UsersStory.js'
import UserModel from '../models/User.js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createStory(req, res){
    const {title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded} = req.body
    
    try {
      console.log(title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded)

      if(!title || !desc || !genreValue || !language || !totalInkNeeded || !numberOfSeries || !userEmail || !ending ){
        return res.status(400).json({ success: false, data: 'Please fill all neccessary fields'})
      }
      
      const user = await UserModel.findOne({ email: userEmail })

      if(!user){
        return res.status(404).json({ success: false, data: 'Invalid User'})
      }

      if(totalInkNeeded > user.totalCredit){
        return res.status(401).json({ success: false, data: 'Insufficient Ink credit'})
      }
      const response = await openai.completions.create({
          model: 'text-davinci-003',
          prompt: `Write a Story based on this title: ${title} and description; ${desc} in ${language} langauage the story should be in this type of genre: ${genreValue} ${mimicAuthor ? `and mimic the writting style of ${mimicAuthor}` : ''} the story should have ${numberOfSeries} number of chapters, each chapter should have a title and this ending style ${ending}. Also from the story give it a good story title`,
          temperature: 0.9,
          max_tokens: 700
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

      const imageRes = await openai.images.generate({
        model: "dall-e-3",
        prompt: `based on this title: ${extractedTitle} and description: ${desc} generate an image`,
        n: 1,
        size: "1024x1792",
        response_format: 'b64_json'
      })
      let storyImage = '';

      if (imageRes.data.length > 0) {
        storyImage = imageRes.data[0].b64_json;
      }

      const coverImageRes = await openai.images.generate({
        model: "dall-e-3",
        prompt: `based on this title: ${extractedTitle} generate a cover image for it that can be used in the background`,
        n: 1,
        size: "1792x1024",
        response_format: 'b64_json'
      })
      let coverImage = '';
      if (coverImageRes.data.length > 0) {
        coverImage = coverImageRes.data[0].b64_json;
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
          coverImage: coverImage
      })
  
      await newStory.save()
      console.log('STORY SAVED>>',newStory)

      user.totalCredit -= totalInkNeeded
      await user.save()
      console.log('USER INK DEDUCTED>>', user.totalCredit)
  
      res.status(201).json({ success: true, data: genertedStory})
  }  catch (error) {
        console.log('ERROR CREATING STORY', error)
        res.status(500).json({ success: false, data: 'Failed to Create Story'})
    }
}

export async function getUserStories(req, res){
  const { id } = req.params
  console.log(id)
  console.log('working')
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