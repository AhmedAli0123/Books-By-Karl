'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { Book } from "@/type/Book";
import BookForm from '@/components/admin/BookForm';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditBookPageProps {
  params: {
    id: string;
  };
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "book" && _id == $id][0]`,
          { id: params.id }
        );
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Book not found</h2>
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Admin
          </Button>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
            <p className="text-muted-foreground">
              Update book information
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <BookForm 
              isEditing={true}
              book={book}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 