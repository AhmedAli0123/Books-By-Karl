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

function BooksTableContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  const handleSortChange = (value: string) => {
    setSortOrder(value as "asc" | "desc");
  };

  return (
    <section
      className="min-h-screen bg-cover bg-fixed bg-center py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/forest-bg.jpg')" }}
    >
      <div className="backdrop-blur-sm bg-[#1f2e22cc] rounded-xl shadow-2xl max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#e0f3df] tracking-wide drop-shadow-lg">
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
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d4635] text-[#d3e9d1] border-[#4a6f5b]">
                <SelectItem value="asc">A to Z</SelectItem>
                <SelectItem value="desc">Z to A</SelectItem>
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
          <div className="overflow-x-auto rounded-xl border border-[#3c604c] shadow-lg">
            <Table>
              <TableHeader className="bg-[#2b4c39]">
                <TableRow>
                  <TableHead className="text-[#e0f3df] text-base font-semibold w-[40%]">Title</TableHead>
                  <TableHead className="text-[#e0f3df] text-base font-semibold">Formats</TableHead>
                  <TableHead className="text-[#e0f3df] text-base font-semibold">Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-[#253e2f]">
                {filteredAndSortedBooks.map((book: Book) => (
                  <TableRow
                    key={book._id}
                    className="hover:bg-[#355d46] transition duration-300"
                  >
                    <TableCell className="text-[#cbe8c7] font-medium">
                      <Link href={`/books/${book.slug.current}`} className="hover:underline">
                        {book.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[#b4dcbc]">{book.formatsAvailable.join(", ")}</TableCell>
                    <TableCell className="text-[#a0c9a4]">
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
