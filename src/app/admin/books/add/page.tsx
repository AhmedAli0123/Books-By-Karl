'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BookForm from '@/components/admin/BookForm';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
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
            <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
            <p className="text-muted-foreground">
              Create a new book entry in your collection
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <BookForm 
              isEditing={false}
              book={null}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 