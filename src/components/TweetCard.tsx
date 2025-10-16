'use client';

import { useState } from 'react';
import { Tweet } from '@/types';
import ReplyForm from '@/components/ReplyForm';
import { useCurrentUser, useDeleteTweet } from '@/hooks/useApi';
import { showToast } from '@/helpers/showToast';
import ReplyList from './ReplyList';

interface TweetCardProps {
  tweet: Tweet;
  onTweetUpdated: (tweet: Tweet) => void;
  onTweetDeleted: () => void;
}

export default function TweetCard({ tweet, onTweetUpdated, onTweetDeleted }: TweetCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
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
  
  return (
    showEditForm ? (
      <TweetFormEdit
        tweet={tweet} 
        onTweetUpdated={onTweetUpdated} 
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

          {canEdit && (
            <div className="dropdown" style={{ justifySelf: 'right', cursor: 'pointer' }}>
              <i
                className="fa-solid fa-gear"
                data-bs-toggle="dropdown"
                style={{ cursor: 'pointer' }}
              ></i>
              <div className="dropdown-menu dropdown-menu-end">
                <button
                  className="dropdown-item"
                  onClick={() => setShowEditForm(true)}
                >
                  <i className="fa-solid fa-pencil"></i> Edit
                </button>
                <button
                  className="dropdown-item"
                  onClick={handleDelete}
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p style={{ whiteSpace: 'pre-wrap' }}>{tweet.content}</p>

        <ReplyList tweetId={tweet.id} />

        <div className="mt-2 mb-2" style={{ borderTop: '1px solid rgb(201 201 201)' }}>
          {showReplyForm ? (
            <ReplyForm
              tweetId={tweet.id}
              onCancel={() => setShowReplyForm(false)}
            />
          ) : (
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={() => setShowReplyForm(true)}
            >
              <i className="fa-solid fa-reply me-1"></i>
              Reply
            </button>
          )}
        </div>
        </div>
      </article>
    )
  );
}


export const TweetFormEdit = ({ tweet, onTweetUpdated, onCancel, style }: { tweet: Tweet, onTweetUpdated: (tweet: Tweet) => void, onCancel: () => void, style: React.CSSProperties }) => {
  const [content, setContent] = useState(tweet.content);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onTweetUpdated({ ...tweet, content });
    onCancel();
    showToast('Tweet updated successfully', 'success');
  };
  return (
    <div style={style}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea className="form-control" id="content" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
}