'use client';

import { useState } from 'react';
import { useCreateReply } from '@/hooks/useApi';

interface ReplyFormProps {
  tweetId: number;
  onCancel: () => void;
}

export default function ReplyForm({ tweetId, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReply } = useCreateReply(tweetId);
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
      await createReply({ content });
      setContent('');
      setErrors([]);
      onCancel();
    } catch (error) {
      setErrors(['An error occurred while posting the reply. Please try again.', (error as Error).message]);
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
