import { createSubcriber } from '../../server/db/controllers/subscriber';

export default async function handler(req, res) {
    
    if (req.method === "POST") {
        if (req.body) {
            const email = req.body.email;
            if (email!=""){
                console.log(email)
                const result = await createSubcriber(email);
                res.json(result);
            } else {
                res.json({});
            }
        }
    } 
}