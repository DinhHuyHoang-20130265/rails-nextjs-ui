'use client';

import { useState } from 'react';
import { Reply } from '@/types';

interface ReplyCardProps {
  reply: Reply;
  onReplyUpdated: (reply: Reply) => void;
  onReplyDeleted: (replyId: number) => void;
}

export default function ReplyCard({ reply, onReplyUpdated, onReplyDeleted }: ReplyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSaveEdit = async () => {
    if (editContent.trim() === reply.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReply: Reply = {
        ...reply,
        content: editContent.trim(),
        updated_at: new Date().toISOString(),
      };
      
      onReplyUpdated(updatedReply);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating reply:', error);
      alert('Failed to update reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(reply.content);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        onReplyDeleted(reply.id);
      } catch (error) {
        console.error('Error deleting reply:', error);
        alert('Failed to delete reply. Please try again.');
      }
    }
  };

  const currentUserId = 1; // Mock current user ID
  const canEdit = reply.user_id === currentUserId;

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
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">{formatDate(reply.created_at)}</small>
                {canEdit && (
                  <div className="dropdown" style={{ cursor: 'pointer' }}>
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
                        <i className="fa fa-pencil"></i> Edit
                      </button>
                      <button 
                        className="dropdown-item" 
                        onClick={handleDelete}
                      >
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-1">
              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="form-control"
                    rows={3}
                  />
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleSaveEdit}
                      disabled={isSubmitting || !editContent.trim()}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
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
