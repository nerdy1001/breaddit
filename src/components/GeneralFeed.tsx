import { INFINITE_SCROLL_PAGINATION_RESULTS } from "../config"
import { db } from "../lib/db"
import PostFeed from "./PostFeed"

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    })

    return <PostFeed isFeed initialPosts={posts} />
}

export default GeneralFeed