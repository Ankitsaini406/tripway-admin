import { useState, useEffect } from "react";

const useEditData = (url, uid, makeRequest, token) => {
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientToken, setClientToken] = useState(null);

    useEffect(() => {
        setClientToken(token || localStorage.getItem("token"));
    }, [token]);

    useEffect(() => {
        if (!uid || !clientToken) return; // Do nothing if UID or token is not provided

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await makeRequest(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${url}/${uid}`,
                    'GET',
                    null,
                    clientToken
                );
                setPerson(response); // Set the person data from response
            } catch (err) {
                console.error("Error fetching person data:", err.message);
                setError("Failed to fetch person data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Fetch person details on hook mount
    }, [url, uid, clientToken, makeRequest]);

    const editData = async (updatedData) => {
        setLoading(true);

        // Create a payload with only the modified fields
        const changes = {};

        // Compare the updated data with the current person data
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] !== person[key]) {
                changes[key] = updatedData[key];
            }
        });

        if (Object.keys(changes).length === 0) {
            setError("No changes made.");
            setLoading(false);
            return;
        }

        try {
            const response = await makeRequest(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${uid}`,
                'PUT',
                changes, // Only send the modified fields
                clientToken
            );
            setPerson(response); // Update local state with the new person data
            return response; // Optionally return response
        } catch (err) {
            console.error("Error updating person data:", err.message);
            setError("Failed to update person data.");
            throw err; // Throw error to be handled by component if needed
        } finally {
            setLoading(false);
        }
    };

    return {
        person,
        loading,
        error,
        editData,
    };
};

export default useEditData;
