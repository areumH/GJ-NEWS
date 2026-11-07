import { fetchNewsFirstPage } from '@/api/server/naver';
import { parseSort } from '@/utils/validator';
import NewsSearchClient from '@/components/NewsSearchClient';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; sort?: string }>;
}) {
  const { query = '', sort: rawSort } = await searchParams;
  // URL의 sort는 임의 문자열일 수 있으므로 허용값 외에는 기본값(sim)으로 처리 (SearchHeader와 같은 규칙)
  const sort = parseSort(rawSort);
  const initialData = query ? await fetchNewsFirstPage(query, sort) : null;

  return <NewsSearchClient query={query} sort={sort} initialData={initialData} />;
}
