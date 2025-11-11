"use client";

import Sidebar from "../../Sidebar";
import { Camera, SquarePen } from "lucide-react";
import { useParams } from "next/navigation";

export default function FieldDetailPage() {
  const params = useParams();
  const fieldId = params.id;

  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="fields" />

      <div className="box-border flex flex-[1_0_0] flex-col gap-[30px] md:gap-[40px] h-full items-center min-h-px min-w-px overflow-y-auto px-[20px] md:px-[40px] py-0 relative shrink-0 w-full pb-20 md:pb-8 md:ml-[60px] lg:ml-[72px]">
        <div className="box-border flex flex-col gap-[18px] md:gap-[22px] items-center px-[20px] md:px-[60px] py-0 relative shrink-0 w-full">
          <div className="bg-transparent h-[30px] md:h-[40px] shrink-0 w-full" />
        </div>
        
        {/* Title and Edit Button */}
        <div className="flex flex-col gap-[12px] md:gap-[14px] items-center relative shrink-0 w-full">
          <div className="flex gap-[20px] md:gap-[30px] items-center justify-center relative shrink-0 w-full">
            <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[36px] md:text-[48px] text-black text-center">
              Ruộng Lúa {fieldId}
            </p>
            <button className="bg-[#2e8623] box-border flex flex-col gap-[10px] items-start justify-center overflow-clip p-[12px] md:p-[15px] relative rounded-[50px] shrink-0 hover:bg-[#267019] transition-colors">
              <SquarePen className="size-[16px] md:size-[18.996px] text-[#fffcf6]" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="relative shrink-0 w-full max-w-[1138px]">
            <div className="bg-[#d9d9d9] h-[12px] w-full rounded-full" />
            <div className="bg-[#2e8623] h-[12px] w-[90%] rounded-full absolute top-0 left-0" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px] relative shrink-0 w-full">
          {/* Left Column - Form Fields */}
          <div className="flex flex-col gap-[25px] md:gap-[30px] items-start justify-center relative shrink-0">
            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Loại Cây
                </p>
                <input 
                  type="text"
                  defaultValue="Lúa"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Giống Cây
                </p>
                <input 
                  type="text"
                  defaultValue="OM 18"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Diện Tích
                </p>
                <input 
                  type="text"
                  defaultValue="2000m²"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Ngày Trồng
                </p>
                <input 
                  type="date"
                  defaultValue="2023-10-23"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Ngày Thu Hoạch Dự Kiến
                </p>
                <input 
                  type="date"
                  defaultValue="2024-02-15"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
              
              <div className="h-[15px] opacity-0" />
              
              <p className="font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[26px] md:text-[32px] text-black text-center w-full">
                <span className="block">Ruộng của bạn hiện tại sao rồi?</span>
                <span className="block">Hãy chụp cho bác sĩ xanh Biết!</span>
              </p>
              
              <button className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] shrink-0 w-full hover:bg-[#267019] transition-colors">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                  Chụp Ngay!
                </p>
                <Camera className="size-[22px] md:size-[27px] text-[#fffcf6]" />
              </button>
            </div>
          </div>

          {/* Right Column - Status and History */}
          <div className="box-border flex flex-col gap-[30px] md:gap-[40px] items-center overflow-clip px-[30px] md:px-[70px] py-0 relative shrink-0">
            <div className="flex flex-col gap-[12px] md:gap-[15px] items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Trạng Thái
                </p>
                <input 
                  type="text"
                  defaultValue="Đang bệnh"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
              <div className="bg-[#ffd2d2] box-border flex flex-col gap-[6px] items-start overflow-clip pb-[12px] pt-[18px] px-[28px] md:px-[38px] relative rounded-[18px] shrink-0 w-full">
                <p className="font-['Be_Vietnam_Pro'] leading-[normal] relative shrink-0 text-[16px] md:text-[20px] text-black w-full">
                  Đang bệnh, bạn hãy chú ý bón phân đầy đủ cho....
                </p>
              </div>
            </div>

            <div className="box-border flex flex-col gap-[12px] md:gap-[15px] items-start overflow-clip px-0 py-[5px] relative shrink-0 w-full">
              <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[26px] md:text-[32px] text-black text-center w-full">
                Lịch Sử
              </p>
              <div className="bg-[#ffd2d2] box-border flex flex-col gap-[5px] md:gap-[6px] items-start leading-[normal] overflow-clip pb-[12px] pt-[18px] px-[28px] md:px-[38px] relative rounded-[18px] shrink-0 text-black text-center w-full">
                <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[24px]">
                  Bệnh
                </p>
                <p className="font-['Be_Vietnam_Pro'] font-medium relative shrink-0 text-[14px] md:text-[16px]">
                  Ngày:26/11/2026
                </p>
              </div>
              <div className="bg-[#b5d5b1] box-border flex flex-col gap-[5px] md:gap-[6px] items-start leading-[normal] overflow-clip pb-[12px] pt-[18px] px-[28px] md:px-[38px] relative rounded-[18px] shrink-0 text-black text-center w-full">
                <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[24px]">
                  Lên Mầm
                </p>
                <p className="font-['Be_Vietnam_Pro'] font-medium relative shrink-0 text-[14px] md:text-[16px]">
                  Ngày:26/11/2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
