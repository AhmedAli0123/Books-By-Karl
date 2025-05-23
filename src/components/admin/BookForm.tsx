'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { Book } from '@/type/Book';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { portableTextToText } from '@/lib/portableTextToText';
import imageUrlBuilder from '@sanity/image-url';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

interface BookFormProps {
  isEditing: boolean;
  book: Book | null;
  onCancel: () => void;
}

export default function BookForm({ isEditing, book, onCancel }: BookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    authors: [] as string[],
    description: '',
    publishedDate: '',
    formatsAvailable: [] as string[],
    bookLink: '',
    slug: '',
    readSample: {
      chapter: '',
      title: '',
      years: '',
      content: ''
    },
    sample: {
      chapter: '',
      title: '',
      content: ''
    }
  });

  useEffect(() => {
    if (isEditing && book) {
      setFormData({
        name: book.name || '',
        author: book.author || '',
        authors: book.authors || [],
        description: portableTextToText(book.description) || '',
        publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : '',
        formatsAvailable: book.formatsAvailable || [],
        bookLink: book.bookLink || '',
        slug: book.slug?.current || '',
        readSample: {
          chapter: book.readSample?.chapter || '',
          title: book.readSample?.title || '',
          years: book.readSample?.years || '',
          content: portableTextToText(book.readSample?.content) || ''
        },
        sample: {
          chapter: book.sample?.chapter || '',
          title: book.sample?.title || '',
          content: portableTextToText(book.sample?.content) || ''
        }
      });
      if (book.image) {
        setPreviewUrl(urlFor(book.image).url());
      }
    }
  }, [isEditing, book]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormatChange = (format: string) => {
    setFormData(prev => ({
      ...prev,
      formatsAvailable: prev.formatsAvailable.includes(format)
        ? prev.formatsAvailable.filter(f => f !== format)
        : [...prev.formatsAvailable, format]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageAsset = null;
      if (imageFile) {
        const imageData = await client.assets.upload('image', imageFile);
        imageAsset = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageData._id
          }
        };
      }

      const bookData = {
        _type: 'book',
        name: formData.name,
        author: formData.author,
        authors: formData.authors,
        description: [
          {
            _type: 'block',
            _key: 'description1',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'description1_span',
                text: formData.description,
                marks: []
              }
            ]
          }
        ],
        publishedDate: formData.publishedDate,
        formatsAvailable: formData.formatsAvailable,
        bookLink: formData.bookLink,
        slug: {
          _type: 'slug',
          current: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
        },
        readSample: formData.readSample.content ? {
          chapter: formData.readSample.chapter,
          title: formData.readSample.title,
          years: formData.readSample.years,
          content: [
            {
              _type: 'block',
              _key: 'readSample1',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  _key: 'readSample1_span',
                  text: formData.readSample.content,
                  marks: []
                }
              ]
            }
          ]
        } : undefined,
        sample: formData.sample.content ? {
          chapter: formData.sample.chapter,
          title: formData.sample.title,
          content: [
            {
              _type: 'block',
              _key: 'sample1',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  _key: 'sample1_span',
                  text: formData.sample.content,
                  marks: []
                }
              ]
            }
          ]
        } : undefined,
        ...(imageAsset && { image: imageAsset })
      };

      if (isEditing && book?._id) {
        await client
          .patch(book._id)
          .set(bookData)
          .commit();
      } else {
        await client.create(bookData);
      }

      Swal.fire({
        title: 'Success!',
        text: `Book ${isEditing ? 'updated' : 'created'} successfully.`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/admin');
      });
    } catch (error) {
      console.error('Error saving book:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save book. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Book Title</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="book-title"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Enter author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookLink">Book Link</Label>
              <Input
                id="bookLink"
                type="url"
                name="bookLink"
                value={formData.bookLink}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/book"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter book description"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Formats Available</Label>
              <div className="flex flex-wrap gap-4">
                {['Ebook', 'Paperback', 'Hardcover'].map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={format}
                      checked={formData.formatsAvailable.includes(format)}
                      onCheckedChange={() => handleFormatChange(format)}
                    />
                    <Label htmlFor={format}>{format}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Book Cover Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {previewUrl && (
                  <div className="relative w-24 h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={previewUrl}
                      alt="Book cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-6">Read Sample</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="readSample.chapter">Chapter</Label>
              <Input
                id="readSample.chapter"
                name="readSample.chapter"
                value={formData.readSample.chapter}
                onChange={handleInputChange}
                placeholder="Enter chapter number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readSample.title">Title</Label>
              <Input
                id="readSample.title"
                name="readSample.title"
                value={formData.readSample.title}
                onChange={handleInputChange}
                placeholder="Enter chapter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readSample.years">Years</Label>
              <Input
                id="readSample.years"
                name="readSample.years"
                value={formData.readSample.years}
                onChange={handleInputChange}
                placeholder="Enter years"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="readSample.content">Content</Label>
              <Textarea
                id="readSample.content"
                name="readSample.content"
                value={formData.readSample.content}
                onChange={handleInputChange}
                placeholder="Enter sample content"
                className="min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-6">Sample</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sample.chapter">Chapter</Label>
              <Input
                id="sample.chapter"
                name="sample.chapter"
                value={formData.sample.chapter}
                onChange={handleInputChange}
                placeholder="Enter chapter number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sample.title">Title</Label>
              <Input
                id="sample.title"
                name="sample.title"
                value={formData.sample.title}
                onChange={handleInputChange}
                placeholder="Enter chapter title"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="sample.content">Content</Label>
              <Textarea
                id="sample.content"
                name="sample.content"
                value={formData.sample.content}
                onChange={handleInputChange}
                placeholder="Enter sample content"
                className="min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
} 