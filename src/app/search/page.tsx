import { fetchNewsFirstPage } from '@/api/serverSearch';
import NewsSearchClient from '@/components/NewsSearchClient';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; sort?: string }>;
}) {
  const { query = '', sort = 'sim' } = await searchParams;
  const initialData = query ? await fetchNewsFirstPage(query, sort) : null;

  return (
    <NewsSearchClient
      query={query}
      sort={sort as 'sim' | 'date'}
      initialData={initialData}
    />
  );
}
