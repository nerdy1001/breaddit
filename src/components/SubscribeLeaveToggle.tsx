'use client'

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '../lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '../hooks/use-custom-toast'
import { toast } from '../hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subredditId, subredditName, isSubscribed }) => {

    const { loginToast } = useCustomToast()
    const router = useRouter()

    const { mutate: subscibe, isLoading: isSubscribing } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError) {
                if(err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'We could not subscibe you at this time. Please try again later.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to br/${subredditName}`
            })
        }
    })

    const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError) {
                if(err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'We could not unsubscibe you at this time. Please try again later.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Unsubscribed',
                description: `You are now unsubscribed from br/${subredditName}`
            })
        }
    })

  return isSubscribed ? (
    <Button isLoading={isUnsubscribing} onClick={() => unsubscribe()} className='w-full mt-1 mb-4'>
        Leave community
    </Button>
  ) : (
    <Button isLoading={isSubscribing} onClick={() => subscibe()} className='w-full mt-1 mb-4'>
        Subscribe
    </Button>
  )
}

export default SubscribeLeaveToggle