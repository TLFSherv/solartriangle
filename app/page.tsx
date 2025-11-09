import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col space-y-40 my-20 mx-auto">
      <Hero />
      <Benefits />
      <HowItWorks />
    </div >
  );
}






