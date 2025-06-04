import { Metadata } from 'next';
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

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents({}).wrapper;

export default async function Page(props: any): Promise<JSX.Element> {
  const params = await props.params;
  const result = (await importPage(params.mdxPath)) as MDXResult;
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
