export interface Book {
    name: string;
    author?: string;
    authors?: string[];
    formatsAvailable: string[];
    image?: string;
    publishedDate: string;
    bookLink: string;
    description: string;
    slug: string;
    readSample?: {
        chapter: string;
        title: string;
        years?: string;
        content: string;
    };
    sample?: {
        chapter?: string;
        title: string;
        content: string;
    };
}