
import { ref, set } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const data = req.body;
        
        if (!data.name || !data.email || !data.uid) {
            return res.status(400).json({ message: 'Name, email, and UID are required' });
        }

        const { uid, name, email, phoneNumber, password, verifyPassword } = data;
        const agentRef = ref(database, 'agents/' + uid);

        await set(agentRef, { name, email, phoneNumber, password, verifyPassword, uid });
        res.status(201).json({ message: 'Agent record saved successfully', agentId: uid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
