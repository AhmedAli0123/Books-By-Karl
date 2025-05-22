import { PortableTextBlock } from '@portabletext/types';

export type Book = {
    _id?: string;
    _type: "book";
    name: string;
    slug: {
        _type: "slug";
        current: string;
    };
    formatsAvailable: string[];
    publishedDate: string;
    image?: {
        _type: "image";
        asset: {
            _type: "reference";
            _ref: string;
        };
    };
    author?: string;
    authors?: string[];
    bookLink: string;
    description: PortableTextBlock[];
    readSample?: {
        chapter: string;
        title: string;
        years?: string;
        content: PortableTextBlock[];
    };
    sample?: {
        chapter?: string;
        title: string;
        content: PortableTextBlock[];
    };
    coverImage?: string;
};