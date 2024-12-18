import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next'; // Import cookies-next

export const useViewData = (token, url, refreshKey) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset state for new requests
        setData(null);
        setLoading(true);

        const fetchData = async () => {
            // Get the token, either passed in as a prop or from cookies (on the client side)
            const storedToken = token || getCookie('token');
            if (!storedToken) {
                console.log("Token is null:", token);
                setError("Token is missing.");
                setLoading(false);
                return;
            }

            try {
                // Use `fetch` directly in Next.js for making requests
                const response = await fetch(`/api/${url}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error making authorized request:', error);
                setError(error.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, url, refreshKey]); // Depend on token, makeRequest, url, and refreshKey

    return { data, loading, error };
};
