import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebaseConfig'; // Make sure to import your Firebase config
import { getCookie } from 'cookies-next'; // Import cookies-next to handle cookies

export const useAddData = (token) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientToken, setClientToken] = useState(null);

    useEffect(() => {
        // Use cookies-next to get the token from cookies if token prop is not available
        setClientToken(token || getCookie("token"));
    }, [token]);

    const addData = async (personData) => {
        setLoading(true);

        const { name, email, phoneNumber, password, verifyPassword } = personData;

        if (!clientToken) {
            console.error("Token is missing");
            setError("Token is missing");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create agent in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Agent created in Firebase Auth:', user);

            // Step 2: Add the user’s UID and other data to Firebase Realtime Database
            const agentRef = ref(database, 'agents/' + user.uid);  // Use UID from Firebase Auth
            await set(agentRef, {
                name,
                email,
                phoneNumber,
                password,  // You can store or exclude sensitive data like password as needed
                verifyPassword,
                uid: user.uid
            });

            console.log("Agent data saved to Realtime Database");

            return { message: "Agent created and data saved successfully", agentId: user.uid };

        } catch (error) {
            console.error("Error adding agent data:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { addData, loading, error };
};
