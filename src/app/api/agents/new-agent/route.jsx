import { ref, set } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

export default async function POST(req, res, { params }) {

    try {
        const { uid, name, email, phoneNumber, password, verifyPassword } = params;
        const agentRef = ref(database, 'agents/' + uid);
        await set(agentRef, { name, email, phoneNumber, password, verifyPassword, uid });
        res.status(201).json({ message: 'Agent record saved successfully', agentId: uid });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

}