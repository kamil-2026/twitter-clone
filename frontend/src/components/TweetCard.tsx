import { Heart, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
}

interface Tweet {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  user: User;
  userId?: string;
}

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const deleteMutation = useMutation({
    mutationFn: (tweetId: string) => api.delete(`/tweets/${tweetId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Tweet deleted');
    },
    onError: () => toast.error('Failed to delete tweet'),
  });

  const likeMutation = useMutation({
    mutationFn: (tweetId: string) => api.post(`/tweets/${tweetId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => toast.error('Failed to update like'),
  });

  return (
    <article className="border-b border-gray-800 p-4 transition hover:bg-gray-900/20">
      <div className="flex gap-3">
        <div className="size-10 shrink-0 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{tweet.user.name}</span>
              <span className="text-gray-500">@{tweet.user.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">
                {new Date(tweet.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {tweet.user.id === currentUserId && (
              <button
                onClick={() => deleteMutation.mutate(tweet.id)}
                className="text-gray-500 transition hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <p className="mt-1 text-white">{tweet.content}</p>
          <div className="mt-3 flex items-center gap-2 text-gray-500">
            <button
              onClick={() => likeMutation.mutate(tweet.id)}
              className="flex items-center gap-1 transition hover:text-pink-500"
            >
              <Heart size={18} />
              <span className="text-sm">{tweet.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
