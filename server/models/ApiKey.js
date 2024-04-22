import mongoose from 'mongoose'

const ApiKeySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
    },
},
{
    timestamps: true
}
)

const ApiKeyModel = mongoose.model('apiKey', ApiKeySchema)
export default ApiKeyModel