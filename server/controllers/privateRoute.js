import OpenAI from 'openai'
import UserStory from '../models/UsersStory.js'
import UserModel from '../models/User.js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createStory(req, res,){
    const {title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded} = req.body
    
    try {
      console.log(title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded)

      if(!title || !desc || !genreValue || !language || totalInkNeeded || numberOfSeries || userEmail || ending ){
        return res.status(400).json({ success: false, data: 'Please fill all neccessary fields'})
      }
      
      const user = await UserModel.find({ email: userEmail })

      if(!user){
        return res.status(404).json({ success: false, data: 'Invalid User'})
      }

      if(totalInkNeeded > user.totalCredit){
        return res.status(401).json({ success: false, data: 'Insufficient Ink credit'})
      }
      const response = await openai.completions.create({
          model: 'text-davinci-003',
          prompt: `Write a Story based on this title: ${title} and description; ${desc} in ${language} langauage the story should be in this type of genre: ${genreValue} ${mimicAuthor ? `and mimic the writting style of ${mimicAuthor}` : ''} the story should have ${numberOfSeries} number of chapters and this ending style ${ending}`,
          temperature: 0.9,
          max_tokens: 700
      })
      //console.log(response)
      console.log('STORY>>', response.choices[0].text)
      const genertedStory = response.choices[0].text
      const newStory = new UserStory({
          story: genertedStory,
          email: userEmail
      })
  
      await newStory.save()
      console.log('STORY SAVED>>',newStory)
  
      res.status(201).json(genertedStory)
  }  catch (error) {
        console.log('ERROR CREATING STORY', error)
        res.status(500).json({ success: false, data: 'Failed to Create Story'})
    }
}