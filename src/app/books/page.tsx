"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book } from "@/type/Book";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

// Sanity query to fetch books
const booksQuery = groq`*[_type == "book"] | order(name asc) {
  _id,
  name,
  slug,
  formatsAvailable,
  publishedDate,
  author,
  image
}`;

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

function BooksTableContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'date-asc' | 'date-desc'>('asc');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await client.fetch(booksQuery);
        setBooks(data);
      } catch (err) {
        setError("Failed to fetch books");
        console.error("Error fetching books:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredAndSortedBooks = [...books]
    .filter(book => 
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.formatsAvailable.some(format => 
        format.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === "date-asc") {
        return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
      } else {
        // date-desc
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      }
    });

  const handleSortChange = (value: string) => {
    setSortOrder(value as "asc" | "desc" | "date-asc" | "date-desc");
  };

  return (
    <section
      className="min-h-screen bg-cover bg-fixed bg-center py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/forest-bg.jpg')" }}
    >
      <div className="backdrop-blur-sm  rounded-xl shadow-2xl max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-bold text-black tracking-wide drop-shadow-lg">
            🌿 Books Library
          </h2>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {searchQuery && (
              <p className="text-[#d3e9d1] text-sm">
                Showing results for: &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-44 bg-[#2d4635] text-[#d3e9d1] border-[#4a6f5b] hover:bg-[#365746] transition">
                <SelectValue placeholder={
                  sortOrder.startsWith('date') ? 'Sort by: Date' : 'Sort by: Title'
                } />
              </SelectTrigger>
              <SelectContent className="bg-[#2d4635] text-[#d3e9d1] border-[#4a6f5b]">
                <SelectItem value="asc">Title (A to Z)</SelectItem>
                <SelectItem value="desc">Title (Z to A)</SelectItem>
                <SelectItem value="date-asc">Published Date (Oldest)</SelectItem>
                <SelectItem value="date-desc">Published Date (Newest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-[#d3e9d1] text-lg">📖 Loading books...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : filteredAndSortedBooks.length === 0 ? (
          <div className="text-center text-[#d3e9d1] text-lg py-8">
            No books found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBooks.map((book: Book) => (
              <Link key={book._id} href={`/books/${book.slug.current}`}>
                <div className="rounded-lg shadow-md p-6 h-full flex flex-col justify-between items-center hover:shadow-xl transition duration-300">
                {book.image && (
                      <Image src={urlFor(book.image).url()} alt={`Cover of ${book.name}`} className=" object-cover rounded-md mb-4" width={138} height={207} />
                    )}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#e0f3df] mb-2">{book.name}</h3>
                    
                    <p className="text-[#b4dcbc] text-sm mb-2">Formats: {book.formatsAvailable.join(", ")}</p>
                    <p className="text-[#a0c9a4] text-sm mb-2">Published: {new Date(book.publishedDate).toLocaleDateString()}</p>
                    {book.author && (
                      <p className="text-[#a0c9a4] text-sm">Author: {book.author}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function BooksTable() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-[#d3e9d1] text-lg">Loading...</div>
      </div>
    }>
      <BooksTableContent />
    </Suspense>
  );
}
