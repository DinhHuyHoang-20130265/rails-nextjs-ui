'use client';

import { useState } from 'react';
import { SortDirection, SortOption, Tweet, TweetFilters } from '@/types';
import TweetForm from '@/components/TweetForm';
import TweetCard from '@/components/TweetCard';
import { useTweets, useCreateTweet, useUpdateTweet } from '@/hooks/useApi';
import { useInfiniteScroll } from '@/helpers/useInfiniteScroll';

export default function TweetList() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<TweetFilters>({
    sort: 'date',
    direction: 'desc',
    page: 1,
    per_page: 10,
  });

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value.split('_').forEach((value: string, index: number) => {
      if (index === 0) {
        setFilters({ ...filters, sort: value as SortOption });
      } else {
        setFilters({ ...filters, direction: value as SortDirection });
      }
    });
  };

  const handleTweetCreated = async (newTweet: { content: string }) => {
    try {
      await createTweet({ content: newTweet.content });
      setShowForm(false);
      mutate();
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };

  const handleTweetUpdated = async (updatedTweet: Tweet) => {
    try {
      await updateTweet({ id: updatedTweet.id, content: updatedTweet.content });
      mutate();
    } catch (error) {
      console.error('Error updating tweet:', error);
    }
  };

  const handleTweetDeleted = () => {
    mutate();
  };

  useInfiniteScroll(async () => {
    if (pagination?.has_more && !isValidating) {
      setSize((prevSize) => prevSize + 1);
    }
  });

  return (
    <div className="container-fluid w-50">
      <h1 className='text-center'>Tweets</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        {showForm && (
          <TweetForm
            onTweetCreated={handleTweetCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
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
        ) : tweets?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No tweets yet. Be the first to post!</p>
          </div>
        ) : (
          tweets?.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onTweetUpdated={handleTweetUpdated}
              onTweetDeleted={handleTweetDeleted}
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
