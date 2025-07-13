import Hero from "@/components/home/Hero";
import Nav from "@/components/home/Nav";
import Counseller from "@/components/home/Counsellor";
import Footer from "@/components/home/Footer";
import CounselingLandingSections from "@/components/home/WhyChoose-us";

export default function Main(){
  return(
    <div>
      <Nav/>
      <Hero/>

      <Counseller/>
      <CounselingLandingSections/>
      <Footer/>

    </div>
  )
}