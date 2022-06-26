import { ENDED } from '../../../server/data-type/projectStatus'
import { getPools } from '../../../contract/services/server/pool'

export default async function handler(req, res) {
    const {
        amount,
        step
    } = req.query;
    
    const result = await getPools(ENDED, amount, step)
    res.json(result)
}