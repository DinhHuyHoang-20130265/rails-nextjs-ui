'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { SortDirection, SortOption, Tweet } from '@/types';
import TweetForm from '@/components/TweetForm';
import TweetCard from '@/components/TweetCard';
import { useTweets, useCreateTweet, useUpdateTweet, useCurrentUser, useDeleteTweet } from '@/hooks/useApi';
import { useInfiniteScroll } from '@/helpers/useInfiniteScroll';
import { useTweetsViewStore } from '@/stores/tweetsViewStore';

interface CreateTweetState { ok: boolean; error?: string }
interface UpdateTweetState { ok: boolean; error?: string }
type OptimisticAction =
  { type: 'add', tweet: Tweet } |
  { type: 'reset' } |
  { type: 'update', tweet: Tweet } |
  { type: 'delete', tweetId: number }

export default function TweetList() {
  const { filters, setFilters, showTweetForm, setShowTweetForm } = useTweetsViewStore();

  const {
    tweets,
    isLoading,
    mutate,
    pagination,
    setSize,
    isValidating,
  } = useTweets(filters);

  const { createTweet } = useCreateTweet();
  const { updateTweet } = useUpdateTweet();
  const { deleteTweet } = useDeleteTweet();
  const { user: currentUser } = useCurrentUser();

  const [optimisticTweets, updateOptimisticTweets] = useOptimistic<Tweet[], OptimisticAction>([], (state, action) => {
    switch (action.type) {
      case 'add':
        return [...state, action.tweet];
      case 'reset':
        return [];
      case 'update':
        return state.map((tweet) => tweet.id === action.tweet.id ? { ...tweet, content: action.tweet.content } : tweet);
      case 'delete':
        return state.filter((tweet) => tweet.id !== action.tweetId);
      default:
        return state;
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value.split('_').forEach((value: string, index: number) => {
      if (index === 0) {
        setFilters({ sort: value as SortOption });
      } else {
        setFilters({ direction: value as SortDirection });
      }
    });
  };

  async function createTweetAction(prev: CreateTweetState, formData: FormData): Promise<CreateTweetState> {
    const content = String(formData.get('content') ?? '').trim();
    if (!content) return { ok: false, error: 'Content is required' };
    try {
      startTransition(async () => {
        const tempTweet: Tweet = {
          id: `temp-${Date.now()}` as unknown as number,
          content,
          created_at: new Date().toISOString(),
          user: currentUser,
          replies_count: 0,
          replies: [],
        } as unknown as Tweet;
        updateOptimisticTweets({ type: 'add', tweet: tempTweet });
        await createTweet({ content });
        await mutate();
        updateOptimisticTweets({ type: 'reset' });
      });
      return { ok: true };
    } catch (error) {
      console.error('Error creating tweet:', error);
      return { ok: false, error: 'Failed to create tweet' };
    }
  }

  const [, formAction] = useActionState<CreateTweetState, FormData>(createTweetAction, { ok: false });

  const updateTweetAction = async (prev: UpdateTweetState, formData: FormData): Promise<UpdateTweetState> => {
    const tweetId = Number(formData.get('tweet_id') ?? '');
    const content = String(formData.get('content') ?? '').trim();
    if (!content) return { ok: false, error: 'Content is required' };
    try {
      startTransition(async () => {
        const tempTweet: Tweet = {
          id: tweetId,
          content,
        } as unknown as Tweet;
        updateOptimisticTweets({ type: 'update', tweet: tempTweet });
        await updateTweet({ id: tweetId, content: content });
        await mutate();
        updateOptimisticTweets({ type: 'reset' });
      });
      return { ok: true };
    } catch (error) {
      console.error('Error updating tweet:', error);
      return { ok: false, error: 'Failed to update tweet' };
    }
  }
  const [, updateTweetFormAction] = useActionState<UpdateTweetState, FormData>(updateTweetAction, { ok: false });
  const handleTweetDeleted = (tweetId: number) => {
    startTransition(async () => {
      updateOptimisticTweets({ type: 'delete', tweetId: tweetId });
      await deleteTweet(tweetId);
      await mutate();
      updateOptimisticTweets({ type: 'reset' });
    });
  };

  useInfiniteScroll(async () => {
    if (pagination?.has_more && !isValidating) {
      setSize((prevSize) => prevSize + 1);
    }
  });

  const renderedTweets = [...optimisticTweets, ...(tweets ?? [])];

  return (
    <div className="container-fluid w-50">
      <h1 className='text-center'>Tweets</h1>

      <div style={{
        marginBottom: '1rem',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        gap: '1rem'
      }}>
        {showTweetForm && (
          <TweetForm
            formAction={(_formData: FormData) => formAction(_formData)}
            onCancel={() => setShowTweetForm(false)}
          />
        )}

        {!showTweetForm && (
          <button
            className="btn btn-primary"
            onClick={() => setShowTweetForm(true)}
          >
            <i className="fa-solid fa-plus me-2"></i>
            New Tweet
          </button>
        )}

        {/* Sorting controls */}
        <div className="mb-1 mt-1">
          <select
            className="form-select w-auto"
            onChange={handleSortChange}
            defaultValue="date_desc"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="most_replies_">Most replies</option>
            <option value="display_name_asc">Display name A→Z</option>
            <option value="display_name_desc">Display name Z→A</option>
          </select>
        </div>
      </div>

      <section id="tweets">
        {isLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : renderedTweets.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No tweets yet. Be the first to post!</p>
          </div>
        ) : (
          renderedTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              updateTweetFormAction={(formData: FormData) => updateTweetFormAction(formData)}
              onTweetDeleted={() => handleTweetDeleted(tweet.id)}
            />
          ))
        )}

        {pagination?.has_more && isValidating && (
          <div id="loading-indicator" className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
