'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const authorImages = [
  { src: '/authors/author.jpg', alt: 'Author ' },
  { src: '/authors/author1.jpg', alt: 'Author 1' },
  { src: '/authors/author2.jpg', alt: 'Author 2' },
  { src: '/authors/author3.jpg', alt: 'Author 3' },
  { src: '/authors/author4.jpg', alt: 'Author 4' },
  { src: '/authors/author5.jpg', alt: 'Author 5' },
  { src: '/authors/author6.jpg', alt: 'Author 6' },
  { src: '/authors/author7.jpg', alt: 'Author 7' },
];

export default function AuthorGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? authorImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === authorImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-10 px-4 md:mx-[135px] md:px-10 bg-black relative overflow-hidden rounded-md ">
      <h2 className="text-3xl font-bold text-left mb-8 text-white">Author Gallery</h2>

      <div className="relative max-w-4xl mx-auto">
        <Button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
          size="icon"
          variant="outline"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="overflow-hidden">
          <div
            className={clsx(
              'flex transition-transform duration-500 ease-in-out',
            )}
            style={{
              transform: `translateX(-${currentIndex * 270}px)`,
            }}
          >
            {authorImages.map((image, index) => (
              <Card
                key={index}
                className="min-w-[250px] mx-2 flex-shrink-0 shadow-lg border-black rounded-md"
              >
                <CardContent className="p-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={200}
                    className="object-fill w-full h-52"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
          size="icon"
          variant="outline"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}
