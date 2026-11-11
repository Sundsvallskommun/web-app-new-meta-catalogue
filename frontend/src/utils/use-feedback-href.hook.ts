import { usePathname, useSearchParams } from 'next/navigation';

export const useFeedbackHref = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (feedback?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (feedback) {
      params.set('feedback', feedback);
    } else {
      params.delete('feedback');
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };
};
