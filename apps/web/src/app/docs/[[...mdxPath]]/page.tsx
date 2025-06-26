import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { ComponentType } from 'react';

import { useMDXComponents as getMDXComponents } from '@/../mdx-components';

type Params = {
  mdxPath: string[];
};

type MDXResult = {
  default: ComponentType<any>;
  toc: any[];
  metadata: Metadata;
};

export const generateStaticParams = generateStaticParamsFor('mdxPath');

const SUPPORTED_EXTENSIONS = ['.md', '.txt'];

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;

  const lastSegment = params.mdxPath?.[params.mdxPath.length - 1];
  if (lastSegment != null && SUPPORTED_EXTENSIONS.some((ext) => lastSegment.endsWith(ext))) {
    return {
      title: 'Documentation',
      description: 'Plain text documentation',
    };
  }

  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents({}).wrapper;

export default async function Page(props: any): Promise<JSX.Element> {
  const params = await props.params;

  const lastSegment = params.mdxPath?.[params.mdxPath.length - 1];
  if (lastSegment != null && SUPPORTED_EXTENSIONS.some((ext) => lastSegment.endsWith(ext))) {
    const pathWithoutExtension = params.mdxPath
      .slice(0, -1)
      .concat([lastSegment.replace(/\.(md|txt)$/, '')]);
    const redirectPath = `/api/docs/${pathWithoutExtension.join('/')}${lastSegment.endsWith('.md') ? '.md' : '.txt'}`;

    redirect(redirectPath);
  }

  const result = (await importPage(params.mdxPath)) as MDXResult;
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
