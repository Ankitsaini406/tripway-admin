import { useState, useEffect } from 'react';

export const useViewData = (token, makeRequest, url, refreshKey) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset state for new requests
        setData(null);
        setLoading(true);

        const fetchData = async () => {
            // Get the token, either passed in or from localStorage (on the client side)
            const storedToken = token || localStorage.getItem('token');
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
    }, [token, makeRequest, url, refreshKey]);

    return { data, loading, error };
};
