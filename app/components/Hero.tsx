import Button from "./Button"
import Link from 'next/link'

export default function Hero() {
  return (
    <div className='space-y-12 mx-4'>
      <h1 className="text-5xl/14 sm:text-7xl/24 text-center tracking-wider font-[Space_Grotesk] text-[#F0662A]">
        Try our solar power calculator
      </h1>
      <h2 className="text-lg text-center tracking-wider font-[Space_Grotesk]">
        The solar power calculator accurately predicts the future power generation of your solar system.
      </h2>
      <div className='flex justify-center md:text-lg font-light font-[Inter]'>
        <Link href={"/calculator"}><Button text={"Try Calculator"} /></Link>
      </div>
    </div>
  )
}