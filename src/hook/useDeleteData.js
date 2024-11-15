import { useState, useEffect } from 'react';

export const useDeleteData = (token, makeRequest) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientToken, setClientToken] = useState(null);

    useEffect(() => {
            setClientToken(token || localStorage.getItem('token'));
    }, [token]);

    const deleteData = async (uid) => {
        setLoading(true);
        setError(null);

        if (!clientToken) {
            console.error("Token is missing.");
            setError("Token is missing.");
            setLoading(false);
            return;
        }

        try {
            // Call the backend API to delete the agent
            await makeRequest(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${uid}`, // Use environment variable for base URL
                'DELETE',
                null,
                clientToken
            );

            console.log("Person deleted successfully from Authentication and Realtime Database");

        } catch (error) {
            console.error("Error deleting agent:", error);
            setError("Failed to delete agent");
        } finally {
            setLoading(false);
        }
    };

    return { deleteData, loading, error };
};
