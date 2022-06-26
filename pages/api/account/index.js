import { createUser } from "../../../server/db/controllers/user"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { Address, Email } = req.body
        
        if (!Address) {
            return res.json({ created: false })
        }

        const result = await createUser({ Address, Email })
        console.log(result);
        return res.json(result)
    }

    return res.status(404).send()
}