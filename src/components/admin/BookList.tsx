'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { Book } from '@/type/Book';
import Swal from 'sweetalert2';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { portableTextToText } from '@/lib/portableTextToText';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

interface BookListProps {
  onEdit: (book: Book) => void;
}

export default function BookList({ onEdit }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await client.fetch(
        groq`*[_type == "book"] | order(publishedDate desc)`
      );
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch books. Please try again.',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await client.delete(id);
      setBooks(books.filter((book) => book._id !== id));
      Swal.fire({
        title: 'Success!',
        text: 'Book has been deleted successfully.',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete book. Please try again.',
        icon: 'error'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book._id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            {book.image && (
              <div className="relative w-20 h-28 flex-shrink-0">
                <Image
                  src={urlFor(book.image).url()}
                  alt={book.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{book.name}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                      }).then((result) => {
                        if (result.isConfirmed && book._id) {
                          handleDelete(book._id);
                        }
                      });
                    }}
                    disabled={isDeleting === book._id}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === book._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {portableTextToText(book.description)}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {book.formatsAvailable?.map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {format}
                  </span>
                ))}
              </div>

              
            </div>
          </div>
        </div>
      ))}

      {books.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No books found. Add your first book using the form on the left.
        </div>
      )}
    </div>
  );
} 