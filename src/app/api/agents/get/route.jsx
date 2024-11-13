import { ref, get } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

export async function GET(req) {
    try {
        const agentRef = ref(database, 'agents');
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return new Response('No agents found', { status: 404 });
        }

        return new Response(JSON.stringify(snapshot.val()), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
