import Editor from '../../../../components/Editor'
import { Button } from '../../../../components/ui/Button'
import { getAuthSession } from '../../../../lib/auth'
import { db } from '../../../../lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
    const session = await getAuthSession()

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: params.slug
        }
    })

    const subscription = await db.subscription.findFirst({
        where: {
            subreddit: {
                name: params.slug
            },
            user: {
                id: session?.user.id
            }
        },
        
    })

    const isSubscribed = !!subscription

    if(!isSubscribed) return (
        <p className='text-lg font-medium text-gray-900'>
            You must be subscribed to this subreddit to post
        </p>
    )

    if (!subreddit) return notFound()

  return (
    <div className='flex flex-col items-start gap-6'>
        <div className='border-b border-200 pb-5'>
            <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
                <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
                    Create Post
                </h3>
                <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
                    in br/{params.slug}
                </p>
            </div>
        </div>
        <Editor subredditId={subreddit.id} />
        <div className='w-full flex justify-end'>
            <Button type='submit' className='w-full ' form='subreddit-post-form'>
                Post
            </Button>
        </div>
    </div>
  )
}

export default page