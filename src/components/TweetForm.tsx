'use client';

import { useState } from 'react';
import { TweetForm as TweetFormData } from '@/types';

interface TweetFormProps {
  onTweetCreated: (tweet: { content: string }) => void;
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
      await onTweetCreated({ content: formData.content });
      setFormData({ content: '' });
    } catch (error) {
      console.error('Error creating tweet:', error);
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
