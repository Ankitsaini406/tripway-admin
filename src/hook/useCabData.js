import { useState, useEffect } from "react";
import useAuth from "@/hook/useAuth";

const useCabsData = (selectedSection, refreshKey) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const endpoint =
                selectedSection === "one-way"
                    ? "/api/cab/one-way/get"
                    : selectedSection === "round-trip"
                    ? "/api/cab/round-trip/get"
                    : "/api/cab/multi-city/get";

            try {
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result || {});
            } catch (err) {
                console.error("Error fetching cab data:", err);
                setError(err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSection, refreshKey, token]);

    return { data, loading, error };
};

export default useCabsData;
