import { getProjectsByOwner, getProjectsByBuyer } from '../../../server/db/controllers/project'

export default async function handler(req, res) {
    const { address } = req.body;
    
    const results = await Promise.all([ getProjectsByOwner(address), getProjectsByBuyer(address) ]);
    
    res.json(results);
}