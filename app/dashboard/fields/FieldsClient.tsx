"use client";

import Sidebar from "../Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { TFarm } from "@/models/farm";
import AddFieldModal from "./components/AddFieldModal";
import EditFieldModal from "./components/EditFieldModal";
import { deleteFarmAction } from "@/action/farm";
import FarmImage from "@/components/FarmImage";

const img1 = "https://www.figma.com/api/mcp/asset/0f961402-38df-4a20-a6fe-dc4ea536b4a6";
const img2 = "https://www.figma.com/api/mcp/asset/45a84cac-4791-4ebf-9f34-1f34823bfc73";

export default function FieldsClient({ fields }: { fields: TFarm[] }) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<TFarm | null>(null);

  const handleEditClick = (e: React.MouseEvent, farm: TFarm) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFarm(farm);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, farmId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Bạn có chắc chắn muốn xóa ruộng này không?")) {
      const success = await deleteFarmAction(farmId);
      if (success) {
        window.location.reload();
      } else {
        alert("Xóa ruộng thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
        <Sidebar activePage="fields" />

        <div className="flex flex-[1_0_0] flex-col gap-[30px] md:gap-[40px] items-center min-h-screen w-full max-w-full relative pb-20 md:pb-8 md:ml-[60px] lg:ml-[72px] overflow-x-hidden">
          <div className="box-border flex flex-col gap-[18px] md:gap-[22px] items-center justify-center px-[20px] md:px-[40px] lg:px-[60px] py-0 relative shrink-0 w-full pt-6 md:pt-8">
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
              {fields?.length > 0 ? fields.map((field) => (
                <Link
                  key={field.id || field.name}
                  href={`/dashboard/fields/${field.id}`}
                  className="bg-[#fffcf6] border-2 border-[#2e8623] border-solid relative rounded-[14.09px] shrink-0 w-full sm:w-[calc(50%-12.5px)] lg:w-[332.691px] hover:shadow-lg transition-shadow group"
                >
                  <div className="box-border flex flex-col gap-[20px] md:gap-[23.484px] items-center overflow-clip pb-[28px] md:pb-[35.226px] pt-[18px] md:pt-[23.484px] px-[18px] md:px-[23.484px] relative rounded-[inherit]">
                    <div className="relative h-[140px] md:h-[165.954px] shrink-0 w-full rounded-[8px] overflow-hidden">
                      <FarmImage 
                        alt={field.name} 
                        src={(field as any).image}
                      />
                    </div>
                    <div className="flex flex-col gap-[5px] md:gap-[6.262px] items-start leading-[normal] relative shrink-0 text-black w-full">
                      <div className="flex justify-between items-start w-full">
                        <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[25.05px]">
                          {field.name || 'N/A'}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => handleEditClick(e, field)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                            title="Sửa thông tin"
                          >
                            <Pencil size={18} className="text-[#2e8623]" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, field.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors z-10"
                            title="Xóa ruộng"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Ngày trồng: {field.planting_date ? new Date(field.planting_date).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Tình Trạng: {field.crop_status || 'N/A'}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Loại cây: {field.crop_type || 'N/A'}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] relative shrink-0 text-[14px] md:text-[15.656px] w-full">
                        Diện tích: {field.area ? `${field.area} m²` : 'N/A'}
                      </p>
                    </div>
                    <div className="absolute h-[75px] md:h-[88.214px] right-[20px] md:right-[24px] bottom-[28px] md:bottom-[35px] w-[71px] md:w-[83.759px]">
                      <Image alt="" className="block max-w-none size-full" src={field.crop_status?.includes('bệnh') ? img1 : img2} width={84} height={88} />
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-center text-gray-500 w-full py-8 col-span-full">Không có dữ liệu ruộng</p>
              )}
            </div>
          </div>
        </div>
      </div >

      <AddFieldModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />

      <EditFieldModal
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        farm={selectedFarm}
      />
    </>
  );
}
