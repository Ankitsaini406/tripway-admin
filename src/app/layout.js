import "./globals.css";

export const metadata = {
  title: "TripWay Holidays Admin",
  description: "Admin Penal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
