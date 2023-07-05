import Link from "next/link"

import UserMenu from "./UserMenu"
import { Icons } from "./ui/Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "../lib/auth"
import SearchBar from "./SearchBar"

const Navbar = async () => {

    const session = await getAuthSession()

    return (
        <div className="fixed top-0 inset-0 h-fit bg-zinc-100 border-zinc-300 z-10 py-2">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                <Link href='/' className="flex gap-2 items-center">
                    <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-slate-900 font-medium text-md md:block">
                        Breaddit
                    </p>
                </Link>

                {/* Searchbar */}
                <SearchBar />
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <Link href='/sign-in' className={buttonVariants()}>
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Navbar