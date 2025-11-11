"use client";

import Sidebar from "../Sidebar";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const imgFrame5 = "https://www.figma.com/api/mcp/asset/0401f921-e135-4181-a203-d0f73461e3e3";

export default function WeatherPage() {
  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="weather" />

      <div className="flex flex-[1_0_0] flex-col gap-[30px] md:gap-[40px] h-full items-center min-h-px min-w-px overflow-clip relative shrink-0 w-full md:ml-[60px] lg:ml-[72px]">
        <div className="box-border flex flex-col gap-[20px] md:gap-[25px] h-[500px] md:h-[650px] items-end justify-end p-[25px] md:p-[35px] relative shrink-0 w-full">
          <Image 
            alt="Weather background" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgFrame5} 
            fill
            priority
          />
          
          {/* Weather Card */}
          <div className="bg-[#fffcf6] border-2 border-[#2e8623] border-solid relative rounded-[14.09px] shrink-0 w-full max-w-[332.691px] z-10">
            <div className="box-border flex flex-col gap-[30px] md:gap-[40.48px] items-center overflow-clip pb-[28px] md:pb-[35.226px] pt-[18px] md:pt-[23.484px] px-[18px] md:px-[23.484px] relative rounded-[inherit]">
              <div className="flex flex-col gap-[14px] md:gap-[18.26px] items-start relative shrink-0 w-full">
                {/* Date Selector */}
                <div className="flex gap-[6px] items-center justify-center relative shrink-0 w-full">
                  <button className="flex items-center justify-center relative shrink-0 hover:opacity-70 transition-opacity">
                    <div className="flex-none rotate-[180deg]">
                      <ChevronLeft className="h-[20px] md:h-[22.685px] w-[12px] md:w-[13.623px] text-[#2e8623]" />
                    </div>
                  </button>
                  
                  <div className="flex flex-[1_0_0] flex-col font-['Be_Vietnam_Pro'] font-semibold items-start leading-[normal] min-h-px min-w-px relative shrink-0 text-black text-center">
                    <p className="relative shrink-0 text-[40px] md:text-[48px] w-full">
                      23
                    </p>
                    <p className="relative shrink-0 text-[17px] md:text-[20px] w-full">
                      Tháng 11
                    </p>
                  </div>
                  
                  <button className="h-[20px] md:h-[22.685px] relative shrink-0 w-[12px] md:w-[13.623px] hover:opacity-70 transition-opacity">
                    <ChevronRight className="h-[20px] md:h-[22.685px] w-[12px] md:w-[13.623px] text-[#2e8623]" />
                  </button>
                </div>
                
                {/* Weather Info */}
                <div className="flex flex-col gap-[5px] items-start leading-[normal] relative shrink-0 text-black w-full">
                  <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[24px] w-full">
                    23° - Mưa
                  </p>
                  <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[13px] md:text-[15.656px] w-full">
                    Hết mưa: 18h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
