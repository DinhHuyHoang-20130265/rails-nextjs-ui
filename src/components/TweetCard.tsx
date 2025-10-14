'use client';

import { useState } from 'react';
import { Tweet, Reply } from '@/types';
import ReplyForm from '@/components/ReplyForm';
import ReplyCard from '@/components/ReplyCard';

interface TweetCardProps {
  tweet: Tweet;
  onTweetUpdated: (tweet: Tweet) => void;
  onTweetDeleted: (tweetId: number) => void;
}

export default function TweetCard({ tweet, onTweetDeleted }: TweetCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  // Mock replies for now
  const mockReplies: Reply[] = [
    {
      id: 1,
      content: 'Great tweet! 👍',
      user_id: 2,
      parent_id: tweet.id,
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      user: {
        id: 2,
        username: 'reply_user',
        display_name: 'Reply User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  ];

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

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit tweet:', tweet.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this tweet?')) {
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        onTweetDeleted(tweet.id);
      } catch (error) {
        console.error('Error deleting tweet:', error);
        alert('Failed to delete tweet. Please try again.');
      }
    }
  };

  const handleReplyCreated = (newReply: Reply) => {
    setReplies(prev => [newReply, ...prev]);
    setShowReplyForm(false);
  };

  const handleLoadMoreReplies = async () => {
    setIsLoadingReplies(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setReplies(mockReplies);
      setShowAllReplies(true);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const currentUserId = 1; // Mock current user ID
  const canEdit = tweet.user_id === currentUserId;
  const displayedReplies = showAllReplies ? replies : replies.slice(0, 5);
  const hasMoreReplies = replies.length > 5 && !showAllReplies;

  return (
    <article
      id={`tweet-${tweet.id}`}
      style={{ border: '1px solid #eee', padding: '8px', margin: '5px' }}
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
                  onClick={handleEdit}
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
        
        <div 
          id={`replies-${tweet.id}`}
          style={{ borderTop: '1px solid #eee', paddingTop: '5px' }}
        >
          {displayedReplies.map(reply => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              onReplyUpdated={(updatedReply: Reply) => {
                setReplies(prev => 
                  prev.map(r => r.id === updatedReply.id ? updatedReply : r)
                );
              }}
              onReplyDeleted={(replyId: number) => {
                setReplies(prev => prev.filter(r => r.id !== replyId));
              }}
            />
          ))}
          
          {hasMoreReplies && (
            <div className="text-center mt-2" id={`load_more_replies_${tweet.id}`}>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleLoadMoreReplies}
                disabled={isLoadingReplies}
              >
                {isLoadingReplies ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  `Load More Replies (${replies.length - 5} more)`
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 mb-2" style={{ borderTop: '1px solid #eee', paddingTop: '5px' }}>
          {showReplyForm ? (
            <ReplyForm
              tweetId={tweet.id}
              onReplyCreated={handleReplyCreated}
              onCancel={() => setShowReplyForm(false)}
            />
          ) : (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowReplyForm(true)}
            >
              <i className="fa-solid fa-reply me-1"></i>
              Reply
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
