'use client';

import { useState } from 'react';
import { Tweet, TweetForm as TweetFormData } from '@/types';

interface TweetFormProps {
  onTweetCreated: (tweet: Tweet) => void;
  onCancel: () => void;
  initialContent?: string;
}

export default function TweetForm({ onTweetCreated, onCancel, initialContent = '' }: TweetFormProps) {
  const [formData, setFormData] = useState<TweetFormData>({
    content: initialContent,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      content: value,
    }));
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
      console.log('Tweet data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock created tweet
      const newTweet: Tweet = {
        id: Date.now(), // Mock ID
        content: formData.content,
        user_id: 1, // Mock user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 1,
          username: 'demo_user',
          display_name: 'Demo User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        reply_count: 0,
      };
      
      onTweetCreated(newTweet);
      
      // Reset form
      setFormData({ content: '' });
    } catch (error) {
      setErrors(['An error occurred while posting the tweet. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.content.trim().length > 0;
  };

  return (
    <div>
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
            value={formData.content}
            onChange={handleInputChange}
            rows={4}
            required
            minLength={1}
            className="form-control"
            placeholder="Write your tweet here..."
            id="floatingTextarea"
          />
          <label htmlFor="floatingTextarea">Write your tweet here...</label>
        </div>
        
        <div className="w-100 text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
