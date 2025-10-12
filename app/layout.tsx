import "./globals.css";
import { GeistSans } from "geist/font/sans";
// Temporarily disabled due to Google Fonts timeout
// import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
//   display: "swap",
//   fallback: ["system-ui", "sans-serif"],
// });

export const metadata = {
  title: "Atlas",
  description:
    "Use the Data Stream Protocol to stream chat completions from a Python endpoint (FastAPI) and display them using the useChat hook in your Next.js application.",
  openGraph: {
    images: [
      {
        url: "/og?title=Atlas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og?title=Atlas",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head></head>
      <body className={cn(GeistSans.className, "antialiased dark h-full overflow-hidden")}>
        <Toaster position="top-center" richColors />
        <div className="flex flex-col h-full">
          <Navbar />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
