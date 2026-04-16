import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useFeed } from '@/hooks/useFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TweetCard } from '@/components/TweetCard';

export default function Home() {
  const { data: feed, isLoading, error } = useFeed();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newTweet: { content: string }) => api.post('/tweets', newTweet),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Tweet posted');
    },
    onError: () => toast.error('Failed to post tweet'),
  });

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading feed</div>;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 p-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      <div className="border-b border-gray-800 p-4">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?!"
          className="mb-2"
        />
        <Button
          onClick={() => createMutation.mutate({ content })}
          disabled={createMutation.isPending || !content.trim()}
        >
          Tweet
        </Button>
      </div>

      {(feed as any[])?.length > 0 ? (
        (feed as any[]).map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
      ) : (
        <div className="p-8 text-center text-gray-500">No tweets found.</div>
      )}
    </div>
  );
}
