import Sidebar from "./Sidebar";
import Image from "next/image";
import farmApi from "@/services/farm";
import { TFarm } from "@/models/farm";

import { getWeatherAdvice } from "@/services/weatherService";
import FarmImage from "@/components/FarmImage";

async function getData(): Promise<TFarm[]> {
  try {
    const productRes = await farmApi.getFarms();
    // Extract farm data from response structure
    const response = productRes as any;
    const farms = response?.data?.data ||
      response?.data?.farms ||
      response?.data ||
      [];

    return Array.isArray(farms) ? farms : [];
  } catch (error) {
    console.error('Failed to fetch farm data:', error);
    return [];
  }
}

async function getAdvice(farmId: string): Promise<string | null> {
  if (!farmId) return null;
  try {
    const result = await getWeatherAdvice(farmId);
    return result?.advice || null;
  } catch (error) {
    console.error('Failed to fetch weather advice:', error);
    return null;
  }
}

const imgImage6 = "https://www.figma.com/api/mcp/asset/4e070d67-dbbd-4d67-b9d1-50ffc064a606";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/2781859a-9304-4399-9002-5e1b53c31c3c";
const imgVector = "https://www.figma.com/api/mcp/asset/fe827d7a-5e7f-40bc-a43b-9c09a9e2a2e0";
const img = "https://www.figma.com/api/mcp/asset/128ff98a-2b21-4648-a0e3-c688323f53a4";
const img1 = "https://www.figma.com/api/mcp/asset/e67b2a82-c3e1-49ef-9428-9c423c769b4f";

export default async function Dashboard() {
  const data = await getData();
  const firstFarm = data.length > 0 ? data[0] : null;
  const advice = firstFarm ? await getAdvice(firstFarm.id) : null;

  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="home" />

      <div className="flex flex-[1_0_0] flex-col gap-[25px] md:gap-[35px] items-center min-h-screen w-full max-w-full relative pb-20 md:pb-8 md:ml-[60px] lg:ml-[72px] overflow-x-hidden">
        <div className="flex flex-col gap-[18px] items-start justify-center relative shrink-0 w-full max-w-full">
          <div className="box-border flex flex-col gap-[18px] md:gap-[22px] items-center justify-center px-[20px] md:px-[40px] lg:px-[50px] py-0 relative shrink-0 w-full max-w-full pt-6 md:pt-8">
            <div className="bg-transparent h-[30px] md:h-[40px] shrink-0 w-full" />
            <div className="capitalize font-['Montserrat'] font-semibold leading-[1.3] relative shrink-0 text-[22px] md:text-[28px] lg:text-[32px] text-black text-center w-full">
              <p className="mb-0">Chào A,</p>
              <p>Bạn Cần Gì? Hãy Nói Cho Tôi Biết</p>
            </div>
            <div className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[10px] h-[50px] md:h-[60px] items-center justify-end px-[11px] py-[8px] relative rounded-[18px] shrink-0 w-full max-w-[700px]">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none px-4 text-[15px] md:text-[16px]"
                placeholder="Tìm kiếm..."
              />
              <button className="relative shrink-0 size-[40px] md:size-[50px] bg-[#2e8623] rounded-full flex items-center justify-center hover:bg-[#267019] transition-colors">
                <Image alt="" className="block max-w-none w-[25px] md:w-[30px] h-[25px] md:h-[30px]" src={imgFrame2} width={40} height={40} />
              </button>
            </div>
          </div>
        </div>

        <div className="box-border flex flex-col gap-[10px] items-start px-[20px] md:px-[40px] lg:px-[50px] py-0 relative shrink-0 w-full max-w-full">
          <div className="bg-[#ffd2d2] box-border flex gap-[12px] md:gap-[20px] items-center px-[18px] md:px-[22px] py-[15px] md:py-[18px] relative rounded-[18px] shrink-0 w-full">
            <div className="h-[30px] md:h-[38px] relative shrink-0 w-[32px] md:w-[40px]">
              <div className="absolute inset-[-3.33%_-3.19%]">
                <Image alt="" className="block max-w-none size-full" src={imgVector} width={50} height={48} />
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Be_Vietnam_Pro'] leading-[1.5] relative text-[14px] md:text-[16px] text-black">
              {advice || "Sắp tới sẽ có mưa to trong vòng 2-3 ngày, bạn hãy chú ý bảo vệ các cây,..."}
            </p>
          </div>
        </div>

        <div className="box-border flex flex-col gap-[15px] md:gap-[18px] items-start justify-center px-[20px] md:px-[40px] lg:px-[50px] py-0 relative shrink-0 w-full max-w-full">
          <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[22px] md:text-[26px] text-black text-center w-full z-10">
            Ruộng Của Bạn
          </p>
          <div className="flex gap-[12px] md:gap-[16px] items-start relative shrink-0 w-full overflow-x-auto pb-4 z-10 scrollbar-hide">
            {data?.length > 0 ? data.map((farm: TFarm) => (
              <div key={farm.id || farm.name} className="bg-[#fffcf6] border-2 border-[#2e8623] border-solid relative rounded-[14.09px] shrink-0 w-[220px] md:w-[250px]">
                <div className="box-border flex flex-col gap-[12px] md:gap-[15px] items-center overflow-clip pb-[20px] md:pb-[24px] pt-[12px] md:pt-[15px] px-[12px] md:px-[15px] relative rounded-[inherit]">
                  <div className="relative h-[110px] md:h-[130px] shrink-0 w-full rounded-[8px] overflow-hidden">
                    <FarmImage
                      alt={farm.name}
                      src={(farm as any).image}
                    />
                  </div>
                  <div className="flex flex-col gap-[4px] md:gap-[5px] items-start leading-[normal] relative shrink-0 text-black w-full">
                    <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[18px] md:text-[20px] w-full">
                      {farm.name || 'N/A'}
                    </p>
                    <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[13px] md:text-[14px] w-full">
                      Ngày trồng: {farm.planting_date ? new Date(farm.planting_date).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                    <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[13px] md:text-[14px] w-full">
                      Tình Trạng: {farm.crop_status || 'N/A'}
                    </p>
                  </div>
                  <div className="absolute h-[65px] md:h-[75px] right-[18px] md:right-[20px] bottom-[24px] md:bottom-[28px] w-[62px] md:w-[71px]">
                    <Image alt="" className="block max-w-none size-full" src={farm.crop_status?.includes('bệnh') ? img : img1} fill />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 w-full py-8">Không có dữ liệu ruộng</p>
            )}
          </div>
        </div>

        <div className="box-border flex flex-col gap-[15px] md:gap-[18px] items-center justify-center px-[20px] md:px-[40px] py-0 relative shrink-0 w-full max-w-full pb-6 md:pb-8">
          <p className="capitalize font-['Playfair_Display'] font-semibold leading-[1.3] relative shrink-0 text-[20px] md:text-[24px] text-black text-center w-full max-w-[600px] z-10">
            Cây bạn có vấn đề Gì À?
          </p>
          <button className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] items-center justify-center px-[20px] md:px-[25px] py-[14px] md:py-[16px] relative rounded-[20px] shrink-0 w-full max-w-[500px] hover:bg-[#267019] transition-colors z-10">
            <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[15px] md:text-[17px] text-[#ebf5ed]">
              Bác sĩ Cây
            </p>
            <div className="overflow-clip relative shrink-0 size-[20px] md:size-[24px]">
              <div className="relative size-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ebf5ed]">
                  <path d="M12 6v4" />
                  <path d="M14 14h-4" />
                  <path d="M14 18h-4" />
                  <path d="M14 8h-4" />
                  <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
                  <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
                </svg>
              </div>
            </div>
          </button>

          <div className="hidden lg:flex absolute items-center justify-center right-[50px] bottom-[80px] -z-10">
            <div className="flex-none rotate-[343.705deg]">
              <div className="h-[180px] opacity-60 relative w-[270px]">
                <Image alt="" className="absolute inset-0 object-cover pointer-events-none size-full" src={imgImage6} fill />
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
