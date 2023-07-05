import { z } from "zod";

export const PostVoteValidator = z.object({
    postId: z.string(),
    VoteType: z.enum(['UP', 'DOWN']),
})

export const CommentVoteValidator = z.object({
    commentId: z.string(),
    VoteType: z.enum(['UP', 'DOWN']),
})

export type CommentVoteValidator = z.infer<typeof CommentVoteValidator>
export type PostVoteRequest = z.infer<typeof PostVoteValidator>