

export async function getPrivateData(req, res, next){
    res.status(200).json({
        success: true,
        data: 'You Have access to this private Data'
    })
}