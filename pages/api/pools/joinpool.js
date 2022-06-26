import { hasJoinedHistory, saveJoinedHistory } from '../../../server/db/controllers/joinedHistory'

export default async function handler(req, res) {
    const { address, account } = req.body;
    
    // save history
    const hasSaved = await hasJoinedHistory(address, account)
    if (!hasSaved) {
        await saveJoinedHistory(address, account)
    }

    res.status(201).send()
}