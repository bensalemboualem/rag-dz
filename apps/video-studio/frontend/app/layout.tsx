import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "IA Factory Video Studio",
  description: "Générateur de vidéos IA pour le marché algérien - Text-to-Video, Image-to-Video avec support Darija",
  keywords: ["IA", "vidéo", "génération", "Algérie", "Darija", "text-to-video", "AI video"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#12121a",
              color: "#f4f4f5",
              border: "1px solid #2a2a3a",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
