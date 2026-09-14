import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Numan Maldar — Full-Stack Engineer & Data Pipeline Architect",
  description:
    "CS graduate from NIT Goa. Full-stack developer and data engineer with industry experience — building GenAI pipelines, MCP servers, and shipped web applications.",
  keywords: [
    "Numan Maldar",
    "Full Stack Developer",
    "Data Engineer",
    "GenAI",
    "Next.js",
    "FastAPI",
    "Dubai",
    "NIT Goa",
  ],
  authors: [{ name: "Numan Maldar" }],
  openGraph: {
    title: "Numan Maldar — Full-Stack Engineer & Data Pipeline Architect",
    description:
      "CS graduate from NIT Goa. Full-stack developer and data engineer with industry experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlex.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
