'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

interface ReplyFormProps {
  tweetId: number;
  onCancel: () => void;
  formAction: (formData: FormData) => void | Promise<void>;
  formState: { ok: boolean; error?: string };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary btn-sm"
      disabled={pending}
    >
      {pending ? <><span className="spinner-border spinner-border-sm me-2"></span>Replying...</> : 'Reply'}
    </button>
  );
}

export default function ReplyForm({ tweetId, onCancel, formAction, formState }: ReplyFormProps) {
  const [content, setContent] = useState(''); // Form state
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContent(value);
    // Clear errors when user starts typing
  };

  return (
    <div className="d-flex align-items-start gap-2 mt-1">
      <div className="reply card mb-2 flex-grow-1">
        <div className="card-body py-2">
          <form action={formAction}>
            {formState.error && (
              <div className="alert alert-danger">
                <ul className="mb-0">
                  <li>{formState.error}</li>
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
                name="content"
                id={`reply_for_${tweetId}`}
              />
              <label htmlFor={`reply_for_${tweetId}`}>Reply…</label>
            </div>

            <div className="d-flex flex-row gap-2 justify-content-start align-items-center mt-2">
              <SubmitButton />

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
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
