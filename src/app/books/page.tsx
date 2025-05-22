"use client"

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
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

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

export default function BooksTable() {
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
        setError('Failed to fetch books');
        console.error('Error fetching books:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleSortChange = (value: string) => {
    setSortOrder(value as 'asc' | 'desc');
  };

  if (isLoading) {
    return (
      <section className="bg-[#252231] py-6">
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="text-center text-gray-200">Loading books...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#252231] py-6">
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#252231] py-6">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4 md:pl-5">
          <h2 className="text-2xl text-gray-100 font-semibold">
            Books Overview
          </h2>
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-[#252231] text-gray-200 border-gray-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#252231] text-gray-200 border-gray-600">
              <SelectItem value="asc">A to Z</SelectItem>
              <SelectItem value="desc">Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="text-gray-200 w-[40%] text-base font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-gray-200 text-base font-semibold">
                  Formats Available
                </TableHead>
                <TableHead className="text-gray-200 text-base font-semibold">
                  Release Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBooks.map((book: Book) => (
                <TableRow key={book._id}>
                  <TableCell className="font-medium text-gray-300">
                    <Link href={`/books/${book.slug.current}`} className="hover:underline">{book.name}</Link>
                  </TableCell>
                  <TableCell className="text-gray-300">{book.formatsAvailable.join(", ")}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
