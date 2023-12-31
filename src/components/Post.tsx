'use client'

import { formatTimeToNow } from '../lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare, Share } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import PostContent from './PostContent'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  subredditName: string
  post: Post & {
    author: User,
    votes: Vote[]
  }
  numberOfComments: number
  numberOfVotes: number
  currentVote?: PartialVote
  isFeed?: boolean

}

const Post: FC<PostProps> = ({ subredditName, post, numberOfComments, numberOfVotes, currentVote, isFeed }) => {

    const postRef = useRef<HTMLDivElement>(null)
  return (
    <div className='rounded-md bg-white shadow'>
        <div className='px-6 py-4 flex justify-between'>
            {/* TODO: post votes */}
            <PostVoteClient postId={post.id} initialVote={currentVote?.type} initialNumberOfVotes={numberOfVotes} />
            <div className='w-0 flex-1'>
                <div className='max-h-40 mt-1 text-xs text-gray-500'>
                    {subredditName && isFeed ? (
                        <>
                            <a className='underline text-zinc-900 text-sm underline-offset-2' href={`/br/${subredditName}`}>
                                br/{subredditName}
                            </a>
                            <span className='px-1'>•</span>
                        </>
                    ) : null}
                    <span>
                        Posted by u/{post.author.username}
                        {'  '}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </span>
                </div>
                <a href={`/br/${subredditName}/post/${post.id}`}>
                    <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
                        {post.title}
                    </h1>
                </a>
                <div className='relative text-sm max-h-40 w-full overflow-clip' ref={postRef}>
                    <PostContent content={post.content} />
                    {postRef.current?.clientHeight === 160 ? (
                        <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
                    ) : null}
                </div>
            </div>
        </div>
        <div className='flex flex-row gap-8 bg-gray-50 z-20 text-sm p-4 sm:px-6'>
        <a className='w-fit flex items-center gap-1' href={`/br/${subredditName}/post/${post.id}`}>
            <MessageSquare className='h-4 w-4' />
            {numberOfComments} comments
        </a>
        <a className='w-fit flex items-center gap-1' href={`/br/${subredditName}/post/${post.id}`}>
            <Share className='h-4 w-4' />
            Share
        </a>
        </div>
    </div>
  )
}

export default Post