import Button from "./Button"
import Link from 'next/link'

export default function Hero() {
  return (
    <div className='space-y-18 mx-4'>
      <h1 className="text-4xl/12 sm:text-7xl/24 text-center tracking-wide font-[Darker_Grotesque] text-[#F0662A]">
        Try our solar power calculator
      </h1>
      <div className='flex justify-center gap-4 text-lg sm:text-2xl md:text-3xl font-light'>
        <Link href={"/calculator"}><Button /></Link>
        <Link href={"/calculator"}><Button /></Link>
      </div>
    </div>
  )
}