import Image from "next/image"
import Link from "next/link";
import Button from "./components/Button";
import graph_lg from "../public/graph-lg.png"
import dataImg from "../public/data-sm.svg"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col space-y-30 sm:space-y-40 my-20">
      {/* Hero Section */}
      <div className='space-y-14 mx-8'>
        <h1 className="text-5xl/14 sm:text-7xl/24 text-center tracking-wider font-[Space_Grotesk] text-[#F0662A]">
          Try our solar power calculator
        </h1>
        <h2 className="text-2xl text-center tracking-wider font-[Space_Grotesk]">
          The solar power calculator accurately predicts the future power generation of your solar system.
        </h2>
        <div className='flex justify-center text-xl font-light font-[Inter]'>
          <Link href={"/calculator"}>
            <Button
              text={"Try Calculator"}
              style="bg-linear-[#DD6B19,#F0662A] w-xs" />
          </Link>
        </div>
      </div>
      {/* Benefits Section */}
      <div className='flex flex-col-reverse sm:flex-row mx-8 gap-12 sm:gap-6 justify-evenly items-center'>
        <ul className="space-y-4 text-xl font-[Inter] font-light list-disc">
          <li>Accurately predict future power generation</li>
          <li>Optimise your solar system</li>
          <li>Keep a history of past performance</li>
          <li>Analyse future performance</li>
        </ul>
        <div>
          <Image src={graph_lg} alt="graph" />
        </div>
      </div>
      {/* Summary section */}
      <div className='flex flex-col sm:flex-row items-center mx-8 gap-6'>
        <Image src={dataImg} alt="data" />
        <div className='text-lg font-[Inter] font-light flex-1 space-y-6'>
          <p className="px-8 text-xl">
            The solar calculator uses the most accurate real
            time weather data, location data and panel performance
            data to give an accurate forecast of future power
            generation of your current or future solar system.
          </p>
          <div className="flex justify-center text-lg font-light font-[Inter]">
            <Link href={"/learn"}>
              <Button
                text="Learn more"
                style="bg-linear-[#DD6B19,#F0662A] w-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}






