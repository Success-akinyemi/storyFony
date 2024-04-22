import ApiKeyModel from "../models/ApiKey.js"


export async function newApiKey(req, res){
    const { key, userId } = req.body
    try {
        const findId = await ApiKeyModel.findOne({ userId: userId })
        if(findId){
            console.log('EXIST', findId)
            findId.key = key
            await findId.save()

            return res.status(200).json({ success: true, data: 'Api key updated'})
        }


        const newKey = await ApiKeyModel.create({
            userId, key
        })

        console.log('NEW KEY SAVED', newKey)

        res.status(201).json({ success: true, data: 'Api key Added successful'})
    } catch (error) {
        console.log('UNABLE TO SAVE NEW API KEY:', error)
        res.status(500).json({ success: false, data: 'Unable to create save new api key'})
    }
}

export async function deleteApikey(req, res){
    const { key, userId} = req.body
    try {
        const findId = ApiKeyModel.findOneAndDelete({ userId: userId })

        res.status(200).json({ success: true, data: 'Api key deleted successful'})
    } catch (error) {
        console.log('UNABLE TO DELETE API KEY', error)
        res.status(500).json({ success: false, data: 'Unable to delete api key' })
    }

}

export async function getApiKey(req, res){
    const {id} = req.params
    try {
        const findId = await ApiKeyModel.findOne({ userId: id })

        res.status(200).json({ success: true, data: findId.key })
    } catch (error) {
        console.log('UNABLE TO GET API KEY', error)
        res.status(500).json({ success: false, data: 'Unable to get api key'})
    }
}