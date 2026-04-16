import { Heart } from 'lucide-react';
import { useFeed } from '@/hooks/useFeed';

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
}

export default function Home() {
  const { data: feed, isLoading, error } = useFeed();

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading feed</div>;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 p-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {(feed as Tweet[])?.length > 0 ? (
        (feed as Tweet[]).map((tweet) => (
          <article
            key={tweet.id}
            className="border-b border-gray-800 p-4 transition hover:bg-gray-900/20"
          >
            <div className="flex gap-3">
              <div className="size-10 shrink-0 rounded-full bg-gray-700" />
              <div className="flex-1">
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
                <p className="mt-1 text-white">{tweet.content}</p>
                <div className="mt-3 flex items-center gap-2 text-gray-500">
                  <button className="flex items-center gap-1 transition hover:text-pink-500">
                    <Heart size={18} />
                    <span className="text-sm">{tweet.likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="p-8 text-center text-gray-500">No tweets found.</div>
      )}
    </div>
  );
}
