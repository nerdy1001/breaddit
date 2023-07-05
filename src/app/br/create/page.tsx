'use client'

import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { CreateSubredditPayload } from "../../../lib/validators/subreddit"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from "../../../hooks/use-toast"
import { useCustomToast } from "../../../hooks/use-custom-toast"

const Page = () => {
    const router = useRouter()
    const { loginToast } = useCustomToast()
    const [input, setInput] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input,
                description: description
            }
            const { data } = await axios.post('/api/subreddit', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError) {
                if(err.response?.status === 409) {
                    return toast({
                        title: 'This subreddit already exists',
                        description: 'Please rename your subreddit',
                        variant: 'destructive'
                    })
                }
                if(err.response?.status === 422) {
                    return toast({
                        title: 'Invalid subreddit name',
                        description: 'Your subreddit name should be between 3 and 21 characters',
                        variant: 'destructive'
                    })
                }
                if(err.response?.status === 401) {
                    return loginToast()
                }
            }

            toast({
                title: 'We ran into a problem',
                description: 'Your subreddit could not be created due to an unknown error',
                variant: 'destructive'
            })
        },
        onSuccess: (data) => {
            router.push(`/br/${data}`)
        }
    })

    return (
        <div className="flex items-center h-full max-w-xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Create community
                    </h1>
                </div>
                <hr className="bg-zinc-500 h-px" />
                <div>
                    <p className="text-lg font-medium">
                        Name
                    </p>
                    <p className="text-xs pb-2 text-zinc-500">
                        Community names including capitalization cannot be changed
                    </p>
                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                            br/
                        </p>
                        <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6" />
                    </div>
                </div>
                <div>
                    <p className="text-lg font-medium">
                        Description
                    </p>
                    <p className="text-xs pb-2 text-zinc-500">
                        What is going on in here ?
                    </p>
                    <div className="relative">
                        <textarea onChange={(e) => setDescription(e.target.value)} rows={5} cols={50} className="rounded-md text-sm border p-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant='subtle' onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => createCommunity()}>
                        Create community
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Page