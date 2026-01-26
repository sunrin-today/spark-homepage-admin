import { User } from "@/lib/types/users"
import Link from "next/link"
import Image from "next/image"
export const UserLink = ({user}: {user: User}) => {
    return (

        <Link href={`/users/${user.id}`} className="underline flex gap-1 items-center w-fit">
            <Image src={user.avatarUrl!} alt="user" width={24} height={24} className="rounded-full" />
            <span>{user.name}</span>
        </Link>
    )
}