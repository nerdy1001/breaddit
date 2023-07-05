import CommentSection from '../../../../../components/CommentSection'
import PostContent from '../../../../../components/PostContent'
import PostVoteServer from '../../../../../components/post-vote/PostVoteServer'
import { buttonVariants } from '../../../../../components/ui/Button'
import { db } from '../../../../../lib/db'
import { redis } from '../../../../../lib/redis'
import { formatTimeToNow } from '../../../../../lib/utils'
import { CachedPost } from '../../../../../types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ThumbsDownIcon } from 'lucide-react'
import { Loader2, ThumbsUpIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { FC, Suspense } from 'react'

interface pageProps {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }: pageProps) => {
  const cachedPost = await redis.hgetall(`post:${params.postId}`) as CachedPost

  let post: (Post & { votes: Vote[], author: User}) | null = null

  if(!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId
      },
      include: {
        votes: true,
        author: true
      },
    })
  }

  if(!post && !cachedPost) return notFound()
  return (
    <div>
      <div className='h-full flex flex-row sm:flex-row items-center sm:items-start justify-between'>
        <div className='sm:w-0 w-full flex-1 flex-row flex bg-white p-4 rounded-md'>
          <Suspense fallback={<PostVoteShell />}>
            {/* @ts-expect-error server component */}
            <PostVoteServer isPostDetails postId={post?.id ?? cachedPost.id } getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId
                },
                include: {
                  votes: true
                },
              })
            }} />
          </Suspense>
          <div className='px-4'>
            <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
              Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
              {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
            </p>
            <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
              {post?.title ?? cachedPost.title}
            </h1>
            <PostContent content={post?.content ?? cachedPost.content} />
            <Suspense fallback={<Loader2 className='h-5 w-5 animate-spin text-zinc-500' />}>
              {/* @ts-expect-error server component */}
              <CommentSection postId={post?.id ?? cachedPost.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ThumbsUpIcon className='h-5 w-5 text-zinc-700' />
      </div>
      {/* vote score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>
      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ThumbsDownIcon className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}

export default page