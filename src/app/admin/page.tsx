"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Book } from "@/type/Book";
import Swal from 'sweetalert2';
import imageUrlBuilder from '@sanity/image-url';
import BookForm from '@/components/admin/BookForm';
import BookList from '@/components/admin/BookList';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedBook(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <BookForm 
            isEditing={isEditing}
            book={selectedBook}
            onCancel={handleCancel}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>
          <BookList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
