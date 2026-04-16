import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateTweet() {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTweet: { content: string }) => api.post('/tweets', newTweet),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Tweet posted!');
    },
    onError: () => toast.error('Failed to post tweet'),
  });

  return (
    <div className="border-b border-gray-800 p-4">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What is happening?!"
        className="mb-2"
      />
      <Button
        onClick={() => mutation.mutate({ content })}
        disabled={mutation.isPending || !content.trim()}
      >
        Tweet
      </Button>
    </div>
  );
}
