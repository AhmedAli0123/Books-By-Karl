import { PortableTextBlock } from '@portabletext/types';

export function portableTextToText(blocks: PortableTextBlock[] | PortableTextBlock | undefined): string {
  if (!blocks) return '';
  
  // Convert single block to array
  const blocksArray = Array.isArray(blocks) ? blocks : [blocks];
  
  return blocksArray
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
} 