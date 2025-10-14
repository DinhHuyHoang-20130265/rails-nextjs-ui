'use client';

import { useState } from 'react';
import { Tweet, TweetFilters, SortOption, SortDirection } from '@/types';
import TweetForm from '@/components/TweetForm';
import TweetCard from '@/components/TweetCard';
import { useTweets, useCreateTweet, useUpdateTweet, useDeleteTweet } from '@/hooks/useApi';

export default function TweetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<TweetFilters>({
    sort: 'date',
    direction: 'desc',
    page: 1,
    per_page: 10,
  });
  
  const { tweets, pagination, isLoading } = useTweets(filters);
  const { createTweet } = useCreateTweet();
  const { updateTweet } = useUpdateTweet();
  const { deleteTweet } = useDeleteTweet();
  const hasMore = pagination?.has_more || false;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sort: SortOption = 'date';
    let direction: SortDirection = 'desc';

    if (value === 'newest') {
      sort = 'date';
      direction = 'desc';
    } else if (value === 'oldest') {
      sort = 'date';
      direction = 'asc';
    } else if (value === 'most_replies') {
      sort = 'most_replies';
    } else if (value === 'name_asc') {
      sort = 'display_name';
      direction = 'asc';
    } else if (value === 'name_desc') {
      sort = 'display_name';
      direction = 'desc';
    }

    setFilters(prev => ({
      ...prev,
      sort,
      direction,
      page: 1,
    }));
  };

  const handleTweetCreated = async (newTweet: Tweet) => {
    try {
      await createTweet({ content: newTweet.content });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };

  const handleTweetUpdated = async (updatedTweet: Tweet) => {
    try {
      await updateTweet({ id: updatedTweet.id, content: updatedTweet.content });
    } catch (error) {
      console.error('Error updating tweet:', error);
    }
  };

  const handleTweetDeleted = async (tweetId: number) => {
    try {
      await deleteTweet(tweetId);
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  return (
    <div className="container-fluid w-50">
      <h1>Tweets</h1>

      <div style={{ marginBottom: '1rem' }}>
        {showForm && (
          <TweetForm 
            onTweetCreated={handleTweetCreated}
            onCancel={() => setShowForm(false)}
          />
        )}
        
        {!showForm && (
          <button 
            className="btn btn-primary mb-3"
            onClick={() => setShowForm(true)}
          >
            <i className="fa-solid fa-plus me-2"></i>
            New Tweet
          </button>
        )}

        {/* Sorting controls */}
        <div className="mb-3 mt-3">
          <select 
            className="form-select w-auto" 
            value={`${filters.sort}_${filters.direction}`}
            onChange={handleSortChange}
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
        ) : tweets.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No tweets yet. Be the first to post!</p>
          </div>
        ) : (
          tweets.map((tweet: Tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onTweetUpdated={handleTweetUpdated}
              onTweetDeleted={handleTweetDeleted}
            />
          ))
        )}

        {hasMore && (
          <div id="loading-indicator" className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </section>

      <p style={{ marginTop: '1rem' }}>
        <a href="/" className="btn btn-primary">
          <i className="fa-solid fa-home me-2"></i>
          Home
        </a>
      </p>
    </div>
  );
}