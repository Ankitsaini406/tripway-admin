import React, { useState } from "react";
import useCabsData from "@/hook/useCabData";
import { toast } from "react-toastify";

const sectionHeaders = {
    "one-way": ["Booking From", "Email", "From", "To", "Passenger", "Phone Number", "Select Car", "Start Date", "Time", "Offer From"],
    "round-trip": ["From", "Destination", "Email", "Passenger", "Phone Number", "Select Car", "Start Date", "Time"],
    "multi-city": ["From", "Destination", "Email", "Passenger", "Phone Number", "Select Car", "Start Date", "Time"],
};

function CabsView() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSection, setSelectedSection] = useState("one-way");

    const { data, loading, error } = useCabsData(selectedSection, refreshKey);

    const handleDeleteAgent = async (uid) => {
        try {
            // await deleteData(uid);
            toast.success("Cab trip deleted");
            setRefreshKey((key) => key + 1);
        } catch {
            toast.error("Error deleting the cab trip");
        }
    };

    const renderRow = (uid) => {
        const cab = data[uid];
        const destination = Array.isArray(cab?.destination) ? cab.destination.join(", ") : cab?.destination || "N/A";

        const sectionData = {
            "one-way": [cab.bookingFrom, cab.email, cab.from, cab.to, cab.passenger, cab.phoneNumber, cab.selectCar, cab.startDate, cab.time, cab.offerFrom],
            "round-trip": [cab.from, cab.destination, cab.email, cab.passenger, cab.phoneNumber, cab.selectCar, cab.startDate, cab.time],
            "multi-city": [cab.from, destination, cab.email, cab.passenger, cab.phoneNumber, cab.selectCar, cab.startDate, cab.time],
        };

        return (
            <tr key={uid}>
                {sectionData[selectedSection].map((value, index) => (
                    <td key={index}>{value}</td>
                ))}
                <td style={{ display: "flex" }}>
                    <button onClick={() => console.log("Edit", uid)} className="editbtn tablebutton">Edit</button>
                    <button onClick={() => handleDeleteAgent(uid)} className="deletebtn tablebutton">Delete</button>
                </td>
            </tr>
        );
    };

    return (
        <>
            {/* Section selection buttons */}
            <div style={{ marginBottom: "20px" }}>
                {["one-way", "round-trip", "multi-city"].map((section) => (
                    <button key={section} onClick={() => setSelectedSection(section)} style={{ marginRight: "10px" }}>
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{Object.keys(data).map(renderRow)}</tbody>
                </table>
            )}
        </>
    );
}

export default CabsView;
