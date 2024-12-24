import React, { useState } from "react";
import useCabsData from "@/hook/useCabData";
import { formatDate, formatTime } from "@/utils/utilsConverter";

const sectionHeaders = {
    "one-way": ["From", "To", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time", "Offer From"],
    "round-trip": ["From", "Destination", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time"],
    "multi-city": ["From", "Destination", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time"],
};

function CabsView() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSection, setSelectedSection] = useState("one-way");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, loading, error } = useCabsData(selectedSection, refreshKey);

    // Filtered Data
    const filteredData = Object.keys(data || {}).filter((uid) => {
        const cab = data[uid];
        const destination = Array.isArray(cab?.destination) ? cab.destination.join(", ") : cab?.destination || "N/A";

        const valuesToSearch = [
            cab.from,
            cab.to,
            cab.email,
            cab.passenger?.toString(),
            cab.phoneNumber,
            cab.carOption,
            formatDate(cab.startDate),
            formatTime(cab.time),
            cab.offerFrom,
            destination,
        ];

        return valuesToSearch.some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const renderRow = (uid) => {
        const cab = data[uid];
        const destination = Array.isArray(cab.destinations) ? cab.destinations.join(", ") : cab.destination || "N/A";

        const sectionData = {
            "one-way": [
                cab.from,
                cab.to,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate),
                formatTime(cab.time),
                cab.offerFrom,
            ],
            "round-trip": [
                cab.from,
                destination,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate),
                formatTime(cab.time),
            ],
            "multi-city": [
                cab.from,
                destination,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate),
                formatTime(cab.time),
            ],
        };

        return (
            <tr key={uid}>
                {sectionData[selectedSection].map((value, index) => (
                    <td key={index}>{typeof value === "object" ? JSON.stringify(value) : value}</td>
                ))}
                <td style={{ display: "flex" }}>
                    <button onClick={() => console.log("Edit", uid)} className="editbtn tablebutton">Pending</button>
                </td>
            </tr>
        );
    };

    return (
        <>
            {/* Section selection buttons */}
            <div className="sectionButtons">
                {["one-way", "round-trip", "multi-city"].map((section) => (
                    <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                    >
                        {section.replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search here..."
                    className="searchBar"
                />

            {/* Data Display */}
            {loading ? (
                <p>Data Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {sectionHeaders[selectedSection].map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map(renderRow)
                        ) : (
                            <tr>
                                <td colSpan={sectionHeaders[selectedSection].length + 1}>No data found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default CabsView;
