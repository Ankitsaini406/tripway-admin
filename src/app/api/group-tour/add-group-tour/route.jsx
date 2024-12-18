import { firestore } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import * as ftp from "basic-ftp";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {

        const ftpUrl = process.env.FTP_HOST;
        const ftpUser = process.env.FTP_USER;
        const ftpPass = process.env.FTP_PASSWORD;
        const ftpPort = process.env.FTP_PORT || 21;

        const formData = await req.formData();
        const file = formData.get("file");
        const metadata = formData.get("metadata");

        if (!file || !metadata) {
            return NextResponse.json({ error: "File and metadata are required" }, { status: 400 });
        }

        const {
            name,
            price,
            category,
            description,
            startDate,
            exclusions,
            inclusions,
            itinerary,
        } = JSON.parse(metadata);

        // Sanitize itinerary
        const sanitizedItinerary = Array.isArray(itinerary)
            ? itinerary.map((item) => ({
                title: item.title || "Untitled",
                description: item.description || "No description provided",
                activities: Array.isArray(item.activities) ? item.activities.filter(Boolean) : [],
            }))
            : [];

        // Convert the uploaded file to a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // FTP configuration
        const client = new ftp.Client();
        client.ftp.verbose = true;

        const ftpConfig = {
            host: ftpUrl,
            user: ftpUser,
            password: ftpPass,
            port: ftpPort,
        };

        const remotePath = `/public_html/tour-image/${file.name}`;
        const fileUrl = `${file.name}`;
        // const fileUrl = `https://tripwayholidays.in/tour-image/${file.name}`;

        const tempFilePath = path.join(__dirname, `./${file.name}`);

        // Save buffer to a temporary local file
        await fs.writeFile(tempFilePath, buffer);

        await client.access(ftpConfig);

        // Ensure that the remotePath directories exist
        const remoteDirPath = `/public_html/tour-image/`;
        
        try {
            await client.ensureDir(remoteDirPath);
            await client.uploadFrom(tempFilePath, remotePath);
        
        } catch (ftpError) {
            return new NextResponse(JSON.stringify({ message: ftpError.message }), { status: 500 });
        } finally {
            client.close();
            await fs.unlink(tempFilePath);
        }

        const tourData = {
            name,
            price,
            category,
            description,
            imageUrl: fileUrl,
            startDate,
            exclusions,
            inclusions,
            itinerary: sanitizedItinerary,
            createdAt: new Date()
        };

        const tourRef = collection(firestore, "group-tours");
        await addDoc(tourRef, tourData);

        return new NextResponse(JSON.stringify({
            message: "Tour created and file successfully uploaded!",
            fileUrl
        }), { status: 201 });

    } catch (generalError) {
        console.error("Tour creation error:", generalError);
        return new NextResponse(JSON.stringify({ message: generalError.message }), { status: 500 });
    }
}
