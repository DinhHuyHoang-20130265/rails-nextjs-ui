'use client';

import { useFormStatus } from 'react-dom';

interface TweetFormProps {
  formAction: (formData: FormData) => void | Promise<void>;
  onCancel: () => void;
  initialContent?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary me-2"
      disabled={pending}
    >
      {pending ? 'Posting...' : 'Post'}
    </button>
  );
}

export default function TweetForm({ formAction, onCancel, initialContent = '' }: TweetFormProps) {
  return (
    <div>
      <form action={formAction}>
        <div className="form-floating">
          <textarea
            name="content"
            defaultValue={initialContent}
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
          <SubmitButton />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
