"use client";

import Sidebar from "../Sidebar";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const imgImage10 = "https://www.figma.com/api/mcp/asset/2c86edef-cc3f-4608-951a-cd71a71e873c";

export default function ProfilePage() {
  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="profile" />

      <div className="box-border flex flex-[1_0_0] flex-col gap-[15px] md:gap-[18px] h-full items-center min-h-px min-w-px overflow-y-auto pb-[30px] pt-[40px] md:pt-[50px] px-[20px] md:px-[40px] relative shrink-0 w-full md:ml-[60px] lg:ml-[72px]">
        {/* Avatar */}
        <div className="flex gap-[20px] items-center justify-center relative shrink-0 pt-4">
          <CircleUserRound className="size-[90px] md:size-[120px] text-[#2e8623]" />
        </div>
        
        <div className="h-[15px] md:h-[18px] shrink-0" />

        {/* Form Fields */}
        <div className="flex flex-col gap-[20px] md:gap-[25px] items-start justify-center relative shrink-0 w-full">
          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[40px] md:px-[120px] lg:px-[160px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Họ và Tên
              </p>
              <input 
                type="text"
                defaultValue="Nguyễn Văn A"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[185px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Tỉnh/Thành Phố
              </p>
              <input 
                type="text"
                defaultValue="TP. Hồ Chí Minh"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[185px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Số điện thoại
              </p>
              <input 
                type="tel"
                defaultValue="0123456789"
                disabled
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] opacity-50 rounded-[18px] shrink-0 w-full px-4 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[185px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Mật Khẩu
              </p>
              <input 
                type="password"
                defaultValue="password123"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[185px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Nhập Lại Mật Khẩu
              </p>
              <input 
                type="password"
                defaultValue="password123"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="box-border flex flex-col gap-[10px] items-start pb-0 pt-[16px] px-0 relative shrink-0 w-full">
            <div className="box-border flex flex-col gap-[10px] items-start px-[100px] md:px-[300px] py-0 relative shrink-0 w-full">
              <button className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] h-[60px] md:h-[71px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] shrink-0 w-full hover:bg-[#267019] transition-colors">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                  lưu Thông Tin
                </p>
              </button>
            </div>
            <div className="box-border flex flex-col gap-[10px] items-start px-[100px] md:px-[300px] py-0 relative shrink-0 w-full">
              <Link 
                href="/dashboard"
                className="bg-[#b5d5b1] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] h-[60px] md:h-[71px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] shrink-0 w-full hover:bg-[#a0c59c] transition-colors"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#191f19]">
                  Thoát
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Image */}
      <div className="hidden lg:flex absolute items-center justify-center right-[100px] bottom-[50px] -z-10">
        <div className="flex-none rotate-[350.359deg]">
          <div className="h-[120.156px] relative w-[145.332px]">
            <Image alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage10} width={145} height={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
