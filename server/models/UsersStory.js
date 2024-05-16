import mongoose from 'mongoose'

export const StorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    story: [{
        chapterTitle: {
            type: String
        },
        chapterContent: {
            type: String
        },
        chapterImage:{
            type: String
        },
        chapterNumber: {
            type: String
        },
    }],
    email: {
        type: String
    },
    motive: {
        type: String
    },
    author: {
        type: String
    },
    authorPenName: {
        type: String
    },
    authorImg: {
        type: String
    },
    genre: {
        type: String
    },
    storyDesc: {
        type: String
    },
    userTitle:{
        type: String
    },
    storyTitle: {
        type: String
    },
    storyLangauage: {
        type: String
    },
    endingStyle: {
        type: String
    },
    storyImage: {
        type: String
    },
    coverImage: {
        type: String
    },
    likes: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User' ,
            ref: 'storyGenertorUsers'
        }
    ],
    privateStory: {
        type: Boolean,
        default: true
    },
    draftStory: {
        type: Boolean,
        default: true
    },
    PublishedToCommunity: {
        type: Boolean,
        default: false
    },
},
{ timestamps: true}
)

const UserStory =  mongoose.model('storyGenertorUserStory', StorySchema);
export default UserStory