import Image from "next/image";
import { ArrowRight } from "lucide-react";
export default function CounsellorsPage() {
    const services = [
        {
            title: "Teen Therapy",
            description: "For teenagers below 18",
            image: "/TeenTherapy.png",
        },
        {
            title: "Individual Therapy",
            description: "For individuals over 18 years old",
            image: "/IndividualTherapy.png",
        },
        {
            title: "Couple Therapy",
            description: "For partners",
            image: "/CoupleTherapy.png",
        },
    ];
    return (
        <>
            <div className="flex items-center justify-center h-screen p-10 bg-[#FEE7E4]">
                <div className="flex w-full max-w-6xl">
                    <div className="grid grid-cols-2 gap-0.5">
                        {["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg"].map((src, index) => (
                            <div key={index} className="w-[174.18px] h-[170.9px] rounded-full overflow-hidden relative">
                                <Image src={src} alt={`Counsellor ${index + 1}`} layout="fill" objectFit="cover" />
                            </div>
                        ))}
                    </div>

                    <div className="ml-10 flex flex-col justify-center relative left-[90px] leading-loose">
                        <h1 className="text-[60px] font-inter font-bold text-[#1045A1] leading-tight">
                            Get going with the best<br />panel of Counsellors
                        </h1>
                        <p className="text-[24px] font-poppins text-black mt-4 max-w-xl leading-tight">
                            At MindfulConnect, we bring together a panel of registered and licensed counsellors specializing in Teen, Couple, and Individual Counselling. Whether you’re navigating relationships, personal struggles, or life’s challenges, our experts are here to guide you with care, compassion, and professionalism.
                        </p>
                        <button className="mt-6 flex items-center bg-[#70C6E6] text-black font-inter text-[20px] px-12 py-3 rounded-[28px] w-[278px] h-[54px]">
                            Find a counsellor<ArrowRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#F9F6FF] h-[725px] flex flex-col items-center justify-center pt-0" >
                <h1 className="text-[60px] font-inter font-bold text-[#1045A1] text-center mb-10 mt-[-40px]">
                    Services we offer!
                </h1>
                <div className="flex gap-20">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="w-[310px] h-[312px] rounded-[20px] overflow-hidden relative bg-cover bg-center transition-transform duration-300 hover:scale-110"
                            style={{ backgroundImage: `url(${service.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                        >
                            <div className="absolute bottom-0 w-[310px] h-[100px] bg-white flex flex-col items-center justify-center">
                                <h2 className="text-[24px] font-poppins font-bold text-black text-center">
                                    {service.title}
                                </h2>
                                <p className="text-[18px] font-roboto text-black text-center">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-20">
                    <Image src="/Arrow.png" alt="arrowdown" width={100} height={100} className="rounded-lg mt-200" />
                </div>
            </div>
        </>
    );
}