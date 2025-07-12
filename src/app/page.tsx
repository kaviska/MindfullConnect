import Hero from "@/components/home/Hero";
import Nav from "@/components/home/Nav";
import Counselloer from "@/components/home/Counsellor";
import Footer from "@/components/home/Footer";

export default function Main(){
  return(
    <div>
      <Nav/>
      <Hero/>

      <Counselloer/>
      <Footer/>

    </div>
  )
}