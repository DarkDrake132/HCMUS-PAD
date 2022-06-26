import { getProjectsByBuyer } from '../../../server/db/controllers/project'

export default async function handler(req, res) {
    const { address } = req.body
    
    const result = await getProjectsByBuyer(address)
    res.json(result)
}