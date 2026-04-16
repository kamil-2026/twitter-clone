import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const { data } = await api.get('/tweets/feed');
      return data;
    },
  });
};
