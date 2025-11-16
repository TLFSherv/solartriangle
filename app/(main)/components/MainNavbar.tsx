import Link from 'next/link'

export default function MainNavbar() {
    return (
        <div className='border border-2 border-[#444444] rounded-3xl py-2 mt-2 mx-4 max-w-6xl'>
            <ul className='flex justify-evenly font-[Darker_Grotesque] text-2xl tracking-wider'>
                <Link href={"/"} ><li>Home</li></Link>
                <Link href={"/calculator"} ><li>Calculator</li></Link>
                <Link href={"/learn"}><li>Learn</li></Link>
                <Link href={""}><li>Research</li></Link>
            </ul>
        </div>
    )
}