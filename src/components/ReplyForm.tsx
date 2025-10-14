'use client';

import { useState } from 'react';
import { Reply } from '@/types';

interface ReplyFormProps {
  tweetId: number;
  onReplyCreated: (reply: Reply) => void;
  onCancel: () => void;
}

export default function ReplyForm({ tweetId, onReplyCreated, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContent(value);
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // TODO: Implement actual API call
      console.log('Reply data:', { content, parent_id: tweetId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock created reply
      const newReply: Reply = {
        id: Date.now(), // Mock ID
        content: content,
        user_id: 1, // Mock user ID
        parent_id: tweetId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 1,
          username: 'demo_user',
          display_name: 'Demo User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      
      onReplyCreated(newReply);
      
      // Reset form
      setContent('');
    } catch (error) {
      setErrors(['An error occurred while posting the reply. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return content.trim().length > 0;
  };

  return (
    <div className="d-flex align-items-start gap-2 mt-1">
      <div className="reply card mb-2 flex-grow-1">
        <div className="card-body py-2">
          <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <div className="alert alert-danger">
                <ul className="mb-0">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-floating">
              <textarea
                value={content}
                onChange={handleInputChange}
                rows={3}
                placeholder="Reply…"
                required
                maxLength={280}
                className="form-control"
                id={`reply_for_${tweetId}`}
              />
              <label htmlFor={`reply_for_${tweetId}`}>Reply…</label>
            </div>
            
            <div className="d-flex flex-row gap-2 justify-content-start align-items-center mt-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Replying...' : 'Reply'}
              </button>
              
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
