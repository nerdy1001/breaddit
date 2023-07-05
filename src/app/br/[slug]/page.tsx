import { getAuthSession } from '../../../lib/auth'
import { db } from '../../../lib/db'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '../../../config'
import { notFound } from 'next/navigation'
import CreatePost from '../../../components/CreatePost'
import PostFeed from '../../../components/PostFeed'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
    const { slug } = params
    const session = await getAuthSession()
    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true
                },
                orderBy: {
                  createdAt: 'desc'
                }, 
                take: INFINITE_SCROLL_PAGINATION_RESULTS
            }
        }
    })

    if (!subreddit) return notFound()
  return (
    <>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          br/{subreddit.name}
        </h1>
        <CreatePost session={session} />
        {/* show posts in user's feed */}
        <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  )
}

export default page