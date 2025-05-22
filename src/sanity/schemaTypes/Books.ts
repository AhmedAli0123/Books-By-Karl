const bookSchema = {
    name: 'book',
    title: 'Book',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Book Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'author',
        title: 'Author',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'authors',
        title: 'Authors',
        type: 'array',
        of: [{ type: 'string' }],
        hidden: ({ document }: any) => !document?.authors,
      },
      {
        name: 'formatsAvailable',
        title: 'Available Formats',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
          list: [
            { title: 'Ebook', value: 'Ebook' },
            { title: 'Paperback', value: 'Paperback' },
            { title: 'Hardcover', value: 'Hardcover' },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'image',
        title: 'Book Cover Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'publishedDate',
        title: 'Published Date',
        type: 'date',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'bookLink',
        title: 'Book Link',
        type: 'url',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              {title: 'Normal', value: 'normal'},
              {title: 'H2', value: 'h2'},
              {title: 'H3', value: 'h3'},
              {title: 'Quote', value: 'blockquote'}
            ],
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
                {title: 'Code', value: 'code'},
                {title: 'Underline', value: 'underline'},
                {title: 'Strike', value: 'strike-through'}
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'Link',
                  fields: [
                    {
                      name: 'href',
                      type: 'url',
                      title: 'URL'
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'image',
            options: {
              hotspot: true
            }
          }
        ],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'readSample',
        title: 'Read Sample',
        type: 'object',
        fields: [
          {
            name: 'chapter',
            title: 'Chapter',
            type: 'string',
          },
          {
            name: 'title',
            title: 'Title',
            type: 'string',
          },
          {
            name: 'years',
            title: 'Years',
            type: 'string',
          },
          {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  {title: 'Normal', value: 'normal'},
                  {title: 'H2', value: 'h2'},
                  {title: 'H3', value: 'h3'},
                  {title: 'Quote', value: 'blockquote'}
                ],
                marks: {
                  decorators: [
                    {title: 'Strong', value: 'strong'},
                    {title: 'Emphasis', value: 'em'},
                    {title: 'Code', value: 'code'},
                    {title: 'Underline', value: 'underline'},
                    {title: 'Strike', value: 'strike-through'}
                  ],
                  annotations: [
                    {
                      name: 'link',
                      type: 'object',
                      title: 'Link',
                      fields: [
                        {
                          name: 'href',
                          type: 'url',
                          title: 'URL'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                type: 'image',
                options: {
                  hotspot: true
                }
              }
            ],
          },
        ],
      },
      {
        name: 'sample',
        title: 'Sample',
        type: 'object',
        fields: [
          {
            name: 'chapter',
            title: 'Chapter',
            type: 'string',
          },
          {
            name: 'title',
            title: 'Title',
            type: 'string',
          },
          {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  {title: 'Normal', value: 'normal'},
                  {title: 'H2', value: 'h2'},
                  {title: 'H3', value: 'h3'},
                  {title: 'Quote', value: 'blockquote'}
                ],
                marks: {
                  decorators: [
                    {title: 'Strong', value: 'strong'},
                    {title: 'Emphasis', value: 'em'},
                    {title: 'Code', value: 'code'},
                    {title: 'Underline', value: 'underline'},
                    {title: 'Strike', value: 'strike-through'}
                  ],
                  annotations: [
                    {
                      name: 'link',
                      type: 'object',
                      title: 'Link',
                      fields: [
                        {
                          name: 'href',
                          type: 'url',
                          title: 'URL'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                type: 'image',
                options: {
                  hotspot: true
                }
              }
            ],
          },
        ],
      },
    ],
    preview: {
      select: {
        title: 'name',
        author: 'author',
        media: 'image',
      },
      prepare({ title, author, media }: any) {
        return {
          title,
          subtitle: author,
          media,
        };
      },
    },
  };

export default bookSchema;