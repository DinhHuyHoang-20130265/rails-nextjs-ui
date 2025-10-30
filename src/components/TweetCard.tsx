'use client';

import { useState } from 'react';
import { Tweet } from '@/types';
import { useCurrentUser, useDeleteTweet } from '@/hooks/useApi';
import ReplyList from './ReplyList';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface TweetCardProps {
  tweet: Tweet;
  updateTweetFormAction: (formData: FormData) => void;
  onTweetDeleted: () => void;
}

export default function TweetCard({ tweet, updateTweetFormAction, onTweetDeleted }: TweetCardProps) {
  const { deleteTweet } = useDeleteTweet();
  const [showEditForm, setShowEditForm] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this tweet?')) {
      try {
        await deleteTweet(tweet.id);
        onTweetDeleted();
      } catch (error) {
        console.error('Error deleting tweet:', error);
        alert('Failed to delete tweet. Please try again.');
      }
    }
  };

  const { user: currentUser } = useCurrentUser();
  const canEdit = tweet.user?.id === currentUser?.id;
  const isOptimistic = typeof (tweet as any).id !== 'number' || !Number.isFinite((tweet as any).id);

  return (
    showEditForm ? (
      <TweetFormEdit
        tweet={tweet}
        updateTweetFormAction={updateTweetFormAction}
        style={{ border: '1px solid rgb(201 201 201)', borderRadius: '10px', padding: '8px', margin: '5px' }}
        onCancel={() => setShowEditForm(false)} />
    ) : (
      <article
        id={`tweet-${tweet.id}`}
        style={{ border: '1px solid rgb(201 201 201)', borderRadius: '10px', padding: '8px', margin: '5px' }}
      >
        <div className="d-flex flex-row justify-content-between align-items-center mb-2">
          <p className="p-0 m-0">
            <i className="fa-solid fa-user"></i>
            <strong> {tweet.user?.display_name || 'Unknown User'}</strong>
          </p>

          <div className="d-flex align-items-center gap-2">
            <small>
              <i className="fa-solid fa-clock"></i>
              {formatDate(tweet.created_at)}
            </small>

            {canEdit &&
              <Menu>
                <MenuButton>
                  <i className="fa-solid fa-gear"></i>
                </MenuButton>
                <MenuItems anchor="bottom" className="flex flex-col bg-white rounded-lg shadow-lg p-2">
                  <MenuItem as="button" className="w-full align-items-center" onClick={() => setShowEditForm(true)}>
                    <i className="fa-solid fa-pencil"></i> Edit
                  </MenuItem>
                  <MenuItem as="button" className="w-full align-items-center" onClick={handleDelete}>
                    <i className="fa-solid fa-trash"></i> Delete
                  </MenuItem>
                </MenuItems>
              </Menu>
            }
          </div>
        </div>

        <div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{tweet.content}</p>

          {isOptimistic ? (
            <div className="mt-2 pt-2">
            </div>
          ) : (
            <ReplyList tweetId={tweet.id as unknown as number} />
          )}
        </div>
      </article>
    )
  );
}


export const TweetFormEdit = ({ tweet, updateTweetFormAction, onCancel, style }:
  {
    tweet: Tweet, updateTweetFormAction: (formData: FormData) => void,
    onCancel: () => void,
    style: React.CSSProperties
  }
) => {
  const [content, setContent] = useState(tweet.content);

  return (
    <div style={style}>
      <form action={(formData: FormData) => {
        onCancel();
        updateTweetFormAction(formData);
      }}>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <input type="hidden" name="tweet_id" value={tweet.id} />
          <textarea name="content" className="form-control" id="content" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
}
