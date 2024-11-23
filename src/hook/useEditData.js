import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

const useEditData = (url, uid, token) => {
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid || !url) {
            console.error("Invalid URL or UID:", { url, uid });
            setError("Invalid URL or UID.");
            return;
        }
        setLoading(true);

        const fetchData = async () => {
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                console.error("Token is missing.");
                setError("Token is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/${url}/${uid}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.json();
                setPerson(data);
            } catch (err) {
                console.error("Error fetching person data:", err.message);
                setError("Failed to fetch person data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, uid, token]);

    const editData = async (updatedData) => {
        if (!person) {
            console.error("No person data to update.");
            setError("No person data to update.");
            return;
        }
    
        setLoading(true);
    
        // Validate required fields
        if (!updatedData.phoneNumber || !updatedData.email) {
            console.error("Missing required fields: phoneNumber or email", updatedData.email, updatedData.phoneNumber);
            setError("Phone number and email are required.");
            setLoading(false);
            return;
        }
    
        const changes = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key] !== person[key]) {
                acc[key] = updatedData[key];
            }
            return acc;
        }, {});
    
        if (Object.keys(changes).length === 0) {
            setError("No changes made.");
            setLoading(false);
            return;
        }
    
        console.log("Payload being sent to API:", changes);
    
        try {
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                console.error("Token is missing.");
                setError("Token is missing.");
                setLoading(false);
                return;
            }
    
            const response = await fetch(`http://localhost:3000/api/${url}/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify(changes),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API response for Bad Request:", errorResponse);
                throw new Error(errorResponse.message || `Failed to update: ${response.statusText}`);
            }
    
            const updatedPerson = await response.json();
            setPerson(updatedPerson);
            return updatedPerson;
        } catch (err) {
            console.error("Error updating person data:", err.message);
            setError("Failed to update person data.");
            throw err;
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
