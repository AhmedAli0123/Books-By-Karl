'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { Book } from '@/type/Book';
import Swal from 'sweetalert2';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { portableTextToText } from '@/lib/portableTextToText';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

interface BookListProps {
  onEdit: (book: Book) => void;
  searchQuery: string;
}

export default function BookList({ onEdit, searchQuery }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const query = `*[_type == "book" ${
          searchQuery
            ? `&& (title match "*${searchQuery}*" || author match "*${searchQuery}*" || isbn match "*${searchQuery}*")`
            : ''
        }] | order(_createdAt desc)`;
        
        const data = await client.fetch(query);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch books. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(id);
        await client.delete(id);
        setBooks(books.filter(book => book._id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Book has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error deleting book:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete book. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium">No books found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {searchQuery ? 'No books match your search criteria.' : 'Get started by adding your first book.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Book</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Formats</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  {book.image && (
                    <div className="relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(book.image).url()}
                        alt={book.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{book.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {portableTextToText(book.description)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {book.formatsAvailable?.map((format) => (
                    <span
                      key={format}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => book._id && handleDelete(book._id)}
                    disabled={isDeleting === book._id}
                    className="text-destructive hover:text-destructive/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === book._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 