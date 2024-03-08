import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    startDate: {
        type: Number
    },
    planType: {
        type: String
    },
    plan: {
        type: String
    },
    endDate: {
        type: Number
    },
    action: {
        type: String
    },
    amount: {
        type: Number
    },
    success: {
        type: Boolean
    },
    userId: {
        type: String
    }
},
{timestamps: true}
)

const SubscriptionModel = mongoose.model('subscription', SubscriptionSchema)
export default SubscriptionModel