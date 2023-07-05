'use client'

import { useCustomToast } from '../../hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { FC, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteRequest } from '../../lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '../../hooks/use-toast'

interface PostVoteClientProps {
  postId: string
  initialNumberOfVotes: number
  initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({ postId, initialNumberOfVotes, initialVote }) => {
    const { loginToast } = useCustomToast()
    const [numberOfVotes, setNumberOfVotes] = useState<number>(initialNumberOfVotes)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const previousVote = usePrevious(currentVote)

    const { mutate: vote } = useMutation({
        mutationFn: async (VoteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                VoteType
            }

            await axios.patch('/api/subreddit/post/vote', payload)
        },
        onError: (err, VoteType) => {
            if(VoteType === 'UP') setNumberOfVotes((prev) => prev - 1)
            else setNumberOfVotes((prev) => prev + 1)

            //reset current 
            setCurrentVote(previousVote)

            if(err instanceof AxiosError) {
                if(err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'We might have a problem',
                description: 'We did not catch that vote, please try again',
                variant: 'destructive'
            })
        },
        onMutate: (type: VoteType) => {
            if(currentVote === type) {
                setCurrentVote(undefined)
                if(type === 'UP') setNumberOfVotes((prev) => prev - 1)
                if(type === 'DOWN') setNumberOfVotes((prev) => prev + 1)
            } else {
                setCurrentVote(type)
                if(type === 'UP') setNumberOfVotes((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN') setNumberOfVotes((prev) => prev - (currentVote ? 2 : 1))
            }
        }
    })

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

  return (
    <div className={`flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0`}>
        <Button onClick={() => vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
            <ThumbsUpIcon className={cn('h-5 w-5 text-zinc-700', {
                'text-emerald-500 fill-emerald-500' : currentVote === 'UP'
            })} />
        </Button>
        <p className='text-center py-2 font-medium text-sm text-zinc-900'>
            {numberOfVotes}
        </p>
        <Button onClick={() => vote('DOWN')} size='sm' variant='ghost' aria-label='upvote'>
            <ThumbsDownIcon className={cn('h-5 w-5 text-zinc-700', {
                'text-red-500 fill-red-500' : currentVote === 'DOWN'
            })} />
        </Button>
    </div>
  )
}

export default PostVoteClient