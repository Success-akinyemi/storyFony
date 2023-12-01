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
    genre: {
        type: String
    },
    userTitle:{
        type: String
    },
    storyTitle: {
        type: String
    },
    storyImage: {
        type: String
    },
    coverImage: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    privateStory: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true}
)

const UserStory =  mongoose.model('storyGenertorUserStory', StorySchema);
export default UserStory