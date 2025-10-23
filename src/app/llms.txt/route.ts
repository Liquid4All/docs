import { NextResponse } from 'next/server';

import { getFileContent, stripFrontmatter } from '@/lib/file';

export async function GET() {
  try {
    const rawContent = await getFileContent('src/content/index.mdx');
    const content = stripFrontmatter(rawContent);
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
