import Image from "next/image"
import Link from "next/link";
import crown_lg from "../public/crown-lg.png"
import circles_lg from "../public/circles-lg.png"


export default function Home() {
  return (
    <div className="flex-1 flex flex-col space-y-30 sm:space-y-40 my-20">
      <section className='space-y-10 mx-8 z-[10]'>
        <h1 className="static text-[54px]/16 sm:text-6xl md:text-7xl text-center tracking-wider font-[Space_Grotesk] text-[#F0662A]">
          Master the Power of the Sun
        </h1>
        <div className="absolute right-0 top-75 mx-6 z-[-1]">
          <Image src={crown_lg} alt="crown" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl text-center tracking-wide font-[Space_Grotesk] font-light">
          Use the solar power calculator to accurately predict the future power generation of your solar system.
        </h2>
        <div className='flex justify-center text-lg font-light font-[Inter]'>
          <Link href={"/calculator"}>
            <button
              type="button"
              className="z-1 py-4.5 rounded-3xl cursor-pointer tracking-wider bg-linear-[97deg,#F6513A,#F0662A,#F2C521] w-xs">
              Solar Calculator
            </button>
          </Link>
        </div>
      </section>
      <section className='relative mx-auto mx-8 space-y-6'>
        <div className="absolute top-[-70] z-[-1]">
          <Image src={circles_lg} alt="circles" />
        </div>
        <h2 className="static text-center text-[#F0662A] text-5xl font-[Darker_Grotesque]">
          Benefits
        </h2>
        <ul className="text-center space-y-3 text-lg sm:text-xl font-[Space_Grotesk] font-light list-disc list-inside">
          <li>Accurately predict future power generation</li>
          <li>Optimise your solar system</li>
          <li>Keep a history of past performance</li>
          <li>Analyse future performance</li>
        </ul>
      </section>
      <section className='mx-auto mx-8 space-y-6'>
        <h2 className="text-center text-[#F0662A] text-5xl font-[Darker_Grotesque]">
          Summary
        </h2>
        <p className="px-20 text-lg sm:text-xl text-center font-[Space_Grotesk] font-light">
          The solar calculator uses the most accurate real
          time weather data, location data and panel performance
          data to give an accurate forecast of future power
          generation of your current or future solar system.
        </p>
        <div className='flex justify-center text-md font-light font-[Inter]'>
          <Link href={"/learn"}>
            <button
              type="button"
              className="py-2 border-3 border-[#F6513A] rounded-2xl cursor-pointer tracking-wider w-sm">
              Learn more
            </button>
          </Link>
        </div>
      </section>
    </div >
  );
}






