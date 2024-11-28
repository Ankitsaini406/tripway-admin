
export const formatDate = (timestamp) => {
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

export const formatTime = (time) => {
    if (!time) return "N/A";

    const [hour, minute] = time.split(":").map(Number);
    let ampm = hour >= 12 ? "PM" : "AM";
    let adjustedHour = hour % 12 || 12;
    return `${String(adjustedHour).padStart(2, "0")}:${minute} ${ampm}`;
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(price);
};

export const truncateDescription = (description, maxLength = 200) => {
    if (!description) return "";
    return description.length > maxLength
        ? `${description.slice(0, maxLength)}...`
        : description;
};
