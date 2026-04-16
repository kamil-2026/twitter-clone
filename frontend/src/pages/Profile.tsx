import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TweetCard } from '@/components/TweetCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}`);
      return data;
    },
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => api.post(`/users/${userId}/follow`),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['user', username] });
      const previousProfile = queryClient.getQueryData(['user', username]);

      queryClient.setQueryData(['user', username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !old.isFollowing,
          stats: {
            ...old.stats,
            followers: old.isFollowing ? old.stats.followers - 1 : old.stats.followers + 1,
          },
        };
      });
      return { previousProfile };
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(['user', username], context?.previousProfile);
      toast.error('Failed to update follow status');
    },
  });

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">User not found</div>;

  const isOwnProfile = profile.id === currentUserId;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-800 bg-black/80 p-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-xs text-gray-500">{profile.stats.tweetCount} tweets</p>
        </div>
      </div>

      <div
        className="h-48 bg-gray-800"
        style={{ backgroundImage: profile.banner ? `url(${profile.banner})` : undefined }}
      />
      <div className="p-4">
        <div className="flex items-end justify-between">
          <div className="-mt-16 size-24 shrink-0 rounded-full border-4 border-black bg-gray-700" />
          {!isOwnProfile && (
            <div className="flex items-end">
              <Button
                onClick={() => followMutation.mutate(profile.id)}
                variant="default"
                size="xs"
                className={`mb-2 shrink-0 rounded-full px-4 text-sm font-bold ${
                  profile.isFollowing
                    ? 'bg-gray-200 text-black hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {profile.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <h1 className="text-2xl font-bold break-words">{profile.name}</h1>
          <p className="text-lg text-gray-500">@{profile.username}</p>
        </div>

        <p className="mt-4 text-base">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1 text-blue-500">
              <LinkIcon size={16} />
              <a href={profile.website} target="_blank" rel="noreferrer">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            Joined{' '}
            {new Date(profile.joinedAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-gray-500">
          <span className="font-bold text-white">
            {profile.stats.following} <span className="font-normal text-gray-500">Following</span>
          </span>
          <span className="font-bold text-white">
            {profile.stats.followers} <span className="font-normal text-gray-500">Followers</span>
          </span>
        </div>
      </div>

      <div className="border-t border-gray-800">
        {profile.tweets.map((tweet: any) => (
          <TweetCard key={tweet.id} tweet={{ ...tweet, user: profile }} />
        ))}
      </div>
    </div>
  );
}
