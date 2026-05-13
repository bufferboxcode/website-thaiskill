import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Dashboard from '@/components/Dashboard'
import About from '@/components/About'
import Team from '@/components/Team'
import Ticker from '@/components/Ticker'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Dashboard />
      <About />
      <section id="services" style={{height:'1px',margin:0,padding:0}} />
      <Team />
      <Ticker />
    </>
  )
}
