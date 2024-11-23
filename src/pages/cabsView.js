import React, { useState } from "react";
import useCabsData from "@/hook/useCabData";
import { toast } from "react-toastify";

const sectionHeaders = {
    "one-way": ["From", "To", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time", "Offer From"],
    "round-trip": ["From", "Destination", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time"],
    "multi-city": ["From", "Destination", "Email", "Passenger", "Phone Number", "Car", "Start Date", "Time"],
};

function CabsView() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSection, setSelectedSection] = useState("one-way");

    const { data, loading, error } = useCabsData(selectedSection, refreshKey);

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        if (timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            const day = String(date.getDate()).padStart(2, "0");
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return timestamp;
    };

    const formTime = (time) => {
        if (!time) return "N/A";
    
        const [hour, minute] = time.split(":").map(Number);
        let ampm = hour >= 12 ? "PM" : "AM";
        let adjustedHour = hour % 12 || 12;
        return `${String(adjustedHour).padStart(2, "0")}:${minute} ${ampm}`;
    };

    const renderRow = (uid) => {
        const cab = data[uid];
        const destination = Array.isArray(cab?.destination) ? cab.destination.join(", ") : cab?.destination || "N/A";

        const sectionData = {
            "one-way": [
                cab.from,
                cab.to,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate), // Format the timestamp
                formTime(cab.time),
                cab.offerFrom,
            ],
            "round-trip": [
                cab.from,
                destination,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate), // Format the timestamp
                formTime(cab.time),
            ],
            "multi-city": [
                cab.from,
                destination,
                cab.email,
                cab.passenger,
                cab.phoneNumber,
                cab.carOption,
                formatDate(cab.startDate), // Format the timestamp
                formTime(cab.time),
            ],
        };

        return (
            <tr key={uid}>
                {sectionData[selectedSection].map((value, index) => (
                    <td key={index}>{typeof value === "object" ? JSON.stringify(value) : value}</td>
                ))}
                <td style={{ display: "flex" }}>
                    <button onClick={() => console.log("Edit", uid)} className="editbtn tablebutton">Panding</button>
                </td>
            </tr>
        );
    };

    return (
        <>
            {/* Section selection buttons */}
            <div style={{ marginBottom: "20px" }}>
                {["one-way", "round-trip", "multi-city"].map((section) => (
                    <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        style={{ marginRight: "10px" }}
                    >
                        {section.replace("-", " ")}
                    </button>
                ))}
            </div>

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
                    <tbody>{Object.keys(data).map(renderRow)}</tbody>
                </table>
            )}
        </>
    );
}

export default CabsView;
