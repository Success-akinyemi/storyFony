import mongoose from 'mongoose'

export const StorySchema = new mongoose.Schema({
    story: {
        type: String
    },
    email: {
        type: String
    }
},
{ timestamps: true}
)

const UserStory =  mongoose.model('storyGenertorUserStory', StorySchema);
export default UserStory