'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { Book } from '@/type/Book';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { portableTextToText } from '@/lib/portableTextToText';
import imageUrlBuilder from '@sanity/image-url';

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
        icon: 'success'
      });

      router.refresh();
      if (!isEditing) {
        setFormData({
          name: '',
          author: '',
          authors: [],
          description: '',
          publishedDate: '',
          formatsAvailable: [],
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
        setImageFile(null);
        setPreviewUrl('');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save book. Please try again.',
        icon: 'error'
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Title
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="book-title"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Published Date
          </label>
          <input
            type="date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Link
          </label>
          <input
            type="url"
            name="bookLink"
            value={formData.bookLink}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formats Available
          </label>
          <div className="flex flex-wrap gap-2">
            {['Ebook', 'Paperback', 'Hardcover'].map((format) => (
              <label key={format} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.formatsAvailable.includes(format)}
                  onChange={() => handleFormatChange(format)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{format}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewUrl && (
              <div className="relative w-24 h-32">
                <Image
                  src={previewUrl}
                  alt="Book cover preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Read Sample</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter
              </label>
              <input
                type="text"
                name="readSample.chapter"
                value={formData.readSample.chapter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="readSample.title"
                value={formData.readSample.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years
              </label>
              <input
                type="text"
                name="readSample.years"
                value={formData.readSample.years}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="readSample.content"
                value={formData.readSample.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sample</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter
              </label>
              <input
                type="text"
                name="sample.chapter"
                value={formData.sample.chapter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="sample.title"
                value={formData.sample.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="sample.content"
                value={formData.sample.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
} 