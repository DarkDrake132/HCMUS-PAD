import { hasKYC } from "../../../server/db/controllers/user";

export default async function handler(req, res) {
    const { address } = req.body
    const result = await hasKYC(address);
    res.send(result)
}