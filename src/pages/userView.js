import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import { useViewData } from "@/hook/useViewData";

function UserView() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const { token } = useAuth();
    const { data } = useViewData(token, 'users/get', refreshKey);

    // Filtered Data
    const filteredData = Object.keys(data || {}).filter((uid) => {
        const user = data[uid];
        const valuesToSearch = [
            user.name,
            user.email,
            user.phoneNumber?.toString(),
        ];

        return valuesToSearch.some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <>
            {/* Search Bar */}
            <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search here..."
                    className="searchBar"
                />

            {/* Data Display */}
            {data ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((uid) => (
                                <tr key={uid}>
                                    <td>{data[uid].name}</td>
                                    <td>{data[uid].email}</td>
                                    <td>{data[uid].phoneNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No data found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default UserView;
