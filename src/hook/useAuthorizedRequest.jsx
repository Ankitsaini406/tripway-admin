import { useState, useCallback } from "react";

function useAuthorizedRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = useCallback(async (url, method = 'GET', data = null, token = '') => {
        setLoading(true);
        setError(null);

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const options = {
            method,
            headers,
        };

        // Add body data if request method is POST, PUT, or PATCH
        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // Check if response is ok
            if (!response.ok) {
                let errorMessage = 'Request failed';

                // Attempt to parse JSON error response, or fallback to plain text
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || 'Request failed';
                } else {
                    errorMessage = await response.text();
                }

                throw new Error(errorMessage);
            }

            // Check if the response is JSON before parsing it
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json(); // Return JSON data
            } else {
                return await response.text(); // Return plain text if not JSON
            }
        } catch (error) {
            console.error('Error making authorized request:', error.message);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { makeRequest, loading, error };
}

export default useAuthorizedRequest;
