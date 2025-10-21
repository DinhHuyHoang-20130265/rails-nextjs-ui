import { useReplies } from "@/hooks/useApi";
import ReplyCard from "./ReplyCard";

interface ReplyListProps {
    tweetId: number;
}

const ReplyList = ({ tweetId }: ReplyListProps) => {
    const { replies, pagination, isLoading, setSize } = useReplies(tweetId, { page: 1, per_page: 5 });
    const hasMoreReplies = pagination?.has_more || false;
    const handleLoadMoreReplies = () => {
        setSize((prevSize) => prevSize + 1);
    };
    return (
        <div
            id={`replies-${tweetId}`}
            style={{ borderTop: replies.length > 0 ? '1px solid rgb(201 201 201)' : 'none', }}
        >
            <div className="d-flex flex-column gap-0 pt-2">
            {replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
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
    );
};

export default ReplyList;