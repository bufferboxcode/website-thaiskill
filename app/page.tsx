import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Dashboard from '@/components/Dashboard'
import About from '@/components/About'
import Services from '@/components/Services'
import Team from '@/components/Team'
import Ticker from '@/components/Ticker'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Dashboard />
      <About />
      <Services />
      <Team />
      <Ticker />
      <Contact />
    </>
  )
}
