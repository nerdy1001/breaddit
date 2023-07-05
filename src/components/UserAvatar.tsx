import { FC } from 'react'
import { User } from 'next-auth'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'
import { AvatarProps } from '@radix-ui/react-avatar'

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
        {user.image ? (
            <div className='relative aspect-square h-full w-full'>
                <Image fill src={user.image} alt='profile-picture' referrerPolicy='no-referrer' />
            </div>
        ) : (
            <AvatarFallback>
                <span className='sr-only'>
                    {user.name}
                </span>
            </AvatarFallback>
        )}
    </Avatar>
)
}

export default UserAvatar