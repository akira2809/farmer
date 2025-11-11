"use client";

import Sidebar from "../Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

const img1 = "https://www.figma.com/api/mcp/asset/0f961402-38df-4a20-a6fe-dc4ea536b4a6";
const img2 = "https://www.figma.com/api/mcp/asset/45a84cac-4791-4ebf-9f34-1f34823bfc73";

export default function FieldsPage() {
  const [showModal, setShowModal] = useState(false);

  // Sample field data - would come from API in real app
  const fields = [
    { id: 1, name: "Lúa", plantDate: "23/10/2023", status: "Bệnh ....", image: img1 },
    { id: 2, name: "Lúa", plantDate: "23/10/2023", status: "Trổ Bông", image: img2 },
    { id: 3, name: "Lúa", plantDate: "23/10/2023", status: "Trổ Bông", image: img2 },
    { id: 4, name: "Lúa", plantDate: "23/10/2023", status: "Trổ Bông", image: img2 },
  ];

  return (
    <>
      <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
        <Sidebar activePage="fields" />

        <div className="flex flex-[1_0_0] flex-col gap-[30px] md:gap-[40px] items-center min-h-screen w-full max-w-full relative pb-20 md:pb-8 md:ml-[60px] lg:ml-[72px] overflow-x-hidden">
          <div className="box-border flex flex-col gap-[18px] md:gap-[22px] items-center justify-center px-[20px] md:px-[40px] lg:px-[60px] py-0 relative shrink-0 w-full max-w-full pt-6 md:pt-8">
            <div className="bg-transparent h-[60px] md:h-[70px] shrink-0 w-full" />
            <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[28px] md:text-[36px] text-black text-center w-full">
              Ruộng Của Bạn
            </p>
            
            <div className="flex gap-[10px] items-start justify-end relative shrink-0 w-full max-w-[1059px]">
              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[12px] md:gap-[15px] items-center justify-center px-[18px] md:px-[22px] py-[14px] md:py-[18px] relative rounded-[22px] shrink-0 hover:bg-[#267019] transition-colors"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[16px] md:text-[18px] text-[#ebf5ed]">
                  Thêm Ruộng
                </p>
                <Plus className="size-[22px] md:size-[27px] text-[#fffcf6]" />
              </button>
            </div>

            <div className="flex flex-wrap gap-[25px] md:gap-[30px] items-start justify-start relative shrink-0 w-full max-w-[1059px]">
              {fields.map((field) => (
                <Link 
                  key={field.id}
                  href={`/dashboard/fields/${field.id}`}
                  className="bg-[#fffcf6] border-2 border-[#2e8623] border-solid relative rounded-[14.09px] shrink-0 w-full sm:w-[calc(50%-12.5px)] lg:w-[332.691px] hover:shadow-lg transition-shadow"
                >
                  <div className="box-border flex flex-col gap-[20px] md:gap-[23.484px] items-center overflow-clip pb-[28px] md:pb-[35.226px] pt-[18px] md:pt-[23.484px] px-[18px] md:px-[23.484px] relative rounded-[inherit]">
                    <div className="bg-[#d9d9d9] h-[140px] md:h-[165.954px] shrink-0 w-full rounded-[8px]" />
                    <div className="flex flex-col gap-[5px] md:gap-[6.262px] items-start leading-[normal] relative shrink-0 text-black w-full">
                      <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[25.05px] w-full">
                        {field.name}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Ngày trồng: {field.plantDate}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Tình Trạng: {field.status}
                      </p>
                    </div>
                    <div className="absolute h-[75px] md:h-[88.214px] right-[20px] md:right-[24px] bottom-[28px] md:bottom-[35px] w-[71px] md:w-[83.759px]">
                      <Image alt="" className="block max-w-none size-full" src={field.image} width={84} height={88} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white box-border flex flex-col gap-[25px] md:gap-[30px] items-start justify-center pb-[40px] md:pb-[50px] pt-[60px] md:pt-[80px] px-0 relative rounded-[18px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex gap-[20px] md:gap-[30px] items-center justify-center relative shrink-0 w-full">
              <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[36px] md:text-[48px] text-black text-center">
                Thêm Ruộng
              </p>
            </div>
            
            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Loại Cây
                </p>
                <input 
                  type="text"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                  placeholder="Nhập loại cây..."
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Giống Cây
                </p>
                <input 
                  type="text"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                  placeholder="Nhập giống cây..."
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Diện Tích
                </p>
                <input 
                  type="text"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                  placeholder="Nhập diện tích..."
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Ngày Trồng
                </p>
                <input 
                  type="date"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
            </div>

            <div className="box-border flex flex-col gap-[10px] items-center overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                  Ngày Thu Hoạch Dự Kiến
                </p>
                <input 
                  type="date"
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                />
              </div>
              
              <div className="h-[15px] w-[36px] opacity-0" />
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[15px] md:gap-[20px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] flex-1 hover:bg-[#d5e5d1] transition-colors"
                >
                  <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#191f19]">
                    Hủy
                  </p>
                </button>
                <button 
                  onClick={() => {
                    // Handle add field
                    setShowModal(false);
                  }}
                  className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] flex-1 hover:bg-[#267019] transition-colors"
                >
                  <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                    Xác Nhận
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
