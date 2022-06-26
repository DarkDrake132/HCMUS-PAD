import { deleteUser, getUser } from "../../../server/db/controllers/user";

export default async function handler(req, res) {
  const { address } = req.query;

  if (req.method === "GET") {
    const user = await getUser(address);
    return res.json(user);

  } else if (req.method === "DELETE") {
      const result = await deleteUser(address);
      return res.json(result)
  }

  return res.status(404).send();
}
