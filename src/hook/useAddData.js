import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';

export const useAddData = (token, makeRequest) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientToken, setClientToken] = useState(null);

    useEffect(() => {
            setClientToken(token || localStorage.getItem('token'));
    }, [token]);

    const addData = async (personData, url) => {
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

            // Step 2: Add the user’s UID to agent data and send it to backend
            const response = await makeRequest(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${url}`, // Use environment variable for the base URL
                'POST',
                { name, email, phoneNumber, password, verifyPassword, uid: user.uid },
                clientToken
            );

            return response;
        } catch (error) {
            console.error("Error adding data:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { addData, loading, error };
};
