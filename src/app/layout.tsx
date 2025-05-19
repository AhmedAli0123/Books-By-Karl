import type { Metadata } from "next";
import { Inter } from "next/font/google";
<link
  href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
  rel="stylesheet"
/>;
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Books By Karl",
  description: "Meet Karl Nystrom, a seasoned entrepreneur and author with a life story that reads like a thrilling adventure novel. His memoir, Living the Dreams, is a true account of his journey from day one to the present, packed with lessons learned and wisdom gained. <br/> With a diverse career spanning the automotive and real estate industries. Karl has also held key positions in various companies, including Director and Secretary for a prominent English firm, CEO in Hong Kong for electronics export, and hotel owner. His entrepreneurial spirit has led him to explore multiple ventures, from constructing hotels in the Philippines to importing products for renewable energy.\n\nAs an Author, Karl&apos;s writing spans multiple genres, including motorcycles, cars, cyber-crimes and food. With many more books in the pipeline, his readers can expect a wide range of topics and inspiration.\n\nKarl&apos;s story is a testament to the power of determination, hard work, and a passion for living the life to fullest. Through his writing, he aims to inspire and motivate others to chase their dreams and never give up."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
