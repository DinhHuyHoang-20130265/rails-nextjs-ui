'use client';

import { useState } from 'react';
import { Reply } from '@/types';
import { useCurrentUser } from '@/hooks/useApi';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useFormStatus } from 'react-dom';
interface ReplyCardProps {
  reply: Reply;
  onReplyDeleted: () => void;
  updateReplyFormAction: (formData: FormData) => void;
}
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary btn-sm me-2" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function ReplyCard({ reply, onReplyDeleted, updateReplyFormAction }: ReplyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
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
    setIsEditing(true);
    setEditContent(reply.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(reply.content);
  };

  const { user: currentUser } = useCurrentUser();
  const canEdit = reply.user?.id === currentUser?.id;

  return (
    <div id={`reply-${reply.id}`}>
      <div className="d-flex align-items-start gap-2">
        <i className="fa-solid fa-reply text-secondary pt-1" aria-hidden="true"></i>
        <div className="reply card mb-2 flex-grow-1">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-baseline">
              <strong className="me-2">
                <i className="fa-solid fa-user"></i>
                {reply.user?.display_name || 'Unknown User'}
              </strong>
              <div className="d-flex align-items-center gap-2 position-relative">
                <small className="text-muted">{formatDate(reply.created_at)}</small>
                {canEdit &&
                  <Menu>
                    <MenuButton>
                      <i className="fa-solid fa-gear"></i>
                    </MenuButton>
                    <MenuItems anchor="bottom" className="flex flex-col bg-white rounded-lg shadow-lg p-2">
                      <MenuItem as="button" className="w-full align-items-center" onClick={handleEdit}>
                        <i className="fa-solid fa-pencil"></i> Edit
                      </MenuItem>
                      <MenuItem as="button" className="w-full align-items-center" onClick={onReplyDeleted}>
                        <i className="fa-solid fa-trash"></i> Delete
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                }
              </div>
            </div>

            <div className="mt-1">
              {isEditing ? (
                <div className="mt-2">
                  <form action={(formData: FormData) => {
                    setIsEditing(false);
                    updateReplyFormAction(formData);
                  }}>
                    <textarea
                      name="content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="form-control"
                      rows={3}
                    />
                    <input type="hidden" name="reply_id" value={reply.id} />
                    <div className="mt-2">
                      <SubmitButton />
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {reply.content}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
