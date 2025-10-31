import { useCreateReply, useCurrentUser, useDeleteReply, useReplies, useUpdateReply } from "@/hooks/useApi";
import ReplyForm from "./ReplyForm";
import ReplyCard from "./ReplyCard";
import { Reply } from "@/types";
import { startTransition, useActionState, useOptimistic, useState } from "react";

interface ReplyListProps {
    tweetId: number;
}
type OptimisticAction =
    { type: 'add', reply: Reply } |
    { type: 'reset' } |
    { type: 'delete', replyId: number } |
    { type: 'update', reply: Reply }
interface CreateReplyState { ok: boolean; error?: string }
interface UpdateReplyState { ok: boolean; error?: string }
const ReplyList = ({ tweetId }: ReplyListProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { replies, pagination, isLoading, setSize, mutate } = useReplies(tweetId, { page: 1, per_page: 5 });
    const { user: currentUser } = useCurrentUser();
    const { createReply } = useCreateReply(tweetId);
    const { updateReply } = useUpdateReply(tweetId);
    const { deleteReply } = useDeleteReply(tweetId);
    const [optimisticReplies, updateOptimisticReplies] = useOptimistic<Reply[], OptimisticAction>([], (state, action) => {
        switch (action.type) {
            case 'add':
                return [...state, action.reply];
            case 'reset':
                return [];
            case 'delete':
                return state.filter((reply) => reply.id !== action.replyId);
            case 'update':
                return state.map((reply) => reply.id === action.reply.id ? { ...reply, content: action.reply.content } : reply);
            default:
                return state;
        }
    });
    const hasMoreReplies = pagination?.has_more || false;
    const handleLoadMoreReplies = () => {
        setSize((prevSize) => prevSize + 1);
    };
    async function createReplyAction(prev: CreateReplyState, formData: FormData): Promise<CreateReplyState> {
        const content = String(formData.get('content') ?? '').trim();
        if (!content) return { ok: false, error: 'Content is required' };
        try {
            startTransition(async () => {
                const tempReply: Reply = {
                    id: `temp-${Date.now()}` as unknown as number,
                    content,
                    user_id: currentUser?.id,
                    parent_id: tweetId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    replies: [],
                    user: currentUser,
                } as unknown as Reply;
                updateOptimisticReplies({ type: 'add', reply: tempReply });
                await createReply({ content });
                await mutate(); // Refresh replies list
                updateOptimisticReplies({ type: 'reset' });
            });
            return { ok: true };
        } catch (error) {
            console.error('Error creating reply:', error);
            return { ok: false, error: 'Failed to create reply' };
        }
    }
    const [, formAction] = useActionState<CreateReplyState, FormData>(createReplyAction, { ok: false });
    async function updateReplyAction(prev: UpdateReplyState, formData: FormData): Promise<UpdateReplyState> {
        const replyId = Number(formData.get('reply_id') ?? '');
        const content = String(formData.get('content') ?? '').trim();
        if (!content) return { ok: false, error: 'Content is required' };
        try {
            startTransition(async () => {
                updateOptimisticReplies({
                    type: 'update', reply: {
                        id: replyId,
                        content,
                    } as unknown as Reply
                });
                await updateReply({ id: replyId, content });
                await mutate();
                updateOptimisticReplies({ type: 'reset' });
            });
            return { ok: true };
        } catch (error) {
            console.error('Error updating reply:', error);
            return { ok: false, error: 'Failed to update reply' };
        }
    }
    const [, updateReplyFormAction] = useActionState<UpdateReplyState, FormData>(updateReplyAction, { ok: false });
    const handleReplyDeleted = (replyId: number) => {
        if (window.confirm('Delete this reply?')) {
            startTransition(async () => {
                updateOptimisticReplies({ type: 'delete', replyId: replyId });
                await deleteReply(replyId);
                await mutate();
                updateOptimisticReplies({ type: 'reset' });
            });
        }
    }
    const displayedReplies = [...(replies || []), ...optimisticReplies];
    return (
        <>
            <div
                id={`replies-${tweetId}`}
                style={{ borderTop: displayedReplies.length > 0 ? '1px solid rgb(201 201 201)' : 'none', }}
            >
                <div className="d-flex flex-column gap-0 pt-2">
                    {displayedReplies.map((reply) => (
                        <ReplyCard
                            key={reply.id} reply={reply}
                            onReplyDeleted={() => handleReplyDeleted(reply.id)}
                            updateReplyFormAction={(formData: FormData) => updateReplyFormAction(formData)} />
                    ))}
                </div>
                {hasMoreReplies && (
                    <div className="text-center mt-2" id={`load_more_replies_${tweetId}`}>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleLoadMoreReplies}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Loading...
                                </>
                            ) : (
                                `Load More Replies (${pagination?.remaining} more)`
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-2 mb-2" style={{ borderTop: '1px solid rgb(201 201 201)' }}>
                {showReplyForm ? (
                    <ReplyForm
                        tweetId={tweetId}
                        onCancel={() => setShowReplyForm(false)}
                        formAction={(_formData: FormData) => formAction(_formData)}
                        formState={{ ok: false, error: undefined as string | undefined }}
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
        </>
    );
};

export default ReplyList;