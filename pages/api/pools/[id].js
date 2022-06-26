import { deleteProject, getProjectById, updateProjectFromPool } from "../../../server/db/controllers/project";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query
        const project = await getProjectById(id)

        return project
    } 
    else if (req.method === "PATCH") {
        const { id } = req.query
        
        const result = await updateProjectFromPool(id)
        return res.json(result)
    } 
    else if (req.method === "DELETE") {
        const { id } = req.query
        const result = await deleteProject(id)
        return res.json(result)
    }
}