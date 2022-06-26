import { createProject } from "../../../server/db/controllers/project"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { PoolAddress, Name, Description, Website, Whitepaper, Twitter, StakeAddress, TokenAddress, OwnerAddress, LogoUrl, BeginTime, EndTime, MoneyRaise } = req.body
        const filledData = [ PoolAddress, Name, Description, Website, Whitepaper, Twitter, StakeAddress, TokenAddress, OwnerAddress, LogoUrl, BeginTime, EndTime, MoneyRaise ].every(e => e != undefined)
        
        if (!filledData) {
            return res.json({ created: false })
        }

        const {project, created} = await createProject({ PoolAddress, Name, Description, Website, Whitepaper, Twitter, StakeAddress, TokenAddress, OwnerAddress, LogoUrl, BeginTime, EndTime, MoneyRaise })
        return res.json({project, created})
    }
}