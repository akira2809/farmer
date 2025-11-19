import Image from "next/image";
import {TFarm, TCreateFarm} from "@/models/farm";
import { createFarmAction } from "@/action/farm";
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Import Dynamic để tắt SSR cho Map
const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-[18px] flex items-center justify-center">
      <p className="text-gray-500 font-['Be_Vietnam_Pro']">Đang tải bản đồ...</p>
    </div>
  ),
});

async function handleAddField(fieldData: TCreateFarm): Promise<TFarm | null> {
  try {
    const result = await createFarmAction(fieldData);
    return result;
  } catch (error) {
    console.error('Error adding field:', error);
    return null;
  }
}

interface AddFieldModalProps {
  showModal: boolean;
  onClose: () => void;
}

export default function AddFieldModal({ showModal, onClose }: AddFieldModalProps) {
  const [locationData, setLocationData] = useState({
    address: '',
    latitude: '',
    longitude: '',
  });

  if (!showModal) return null;

  const handleMapSelect = (address: string, lat: number, lng: number) => {
    setLocationData({
      address,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fieldData: TCreateFarm = {
      crop_type: formData.get('crop_type') as string,
      name: formData.get('name') as string,
      area: formData.get('area') as string,
      planting_date: formData.get('planting_date') as string,
      expected_harvest_date: formData.get('expected_harvest_date') as string,
      latitude: locationData.latitude || (formData.get('latitude') as string),
      longitude: locationData.longitude || (formData.get('longitude') as string),
    };
    
    const result = await handleAddField(fieldData);
    if (result) {
      onClose();
      window.location.reload();
    } else {
      alert('Có lỗi xảy ra khi tạo ruộng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
      <div className="bg-white box-border flex flex-col gap-[25px] md:gap-[30px] items-start pb-[40px] md:pb-[50px] pt-[30px] md:pt-[40px] px-0 relative rounded-[18px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex gap-[20px] md:gap-[30px] items-center justify-center relative shrink-0 w-full px-[50px] md:px-[70px]">
          <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[32px] md:text-[40px] text-black text-center">
            Thêm Ruộng
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[25px] w-full">
          <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Loại Cây
              </p>
              <input 
                type="text"
                name="crop_type"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                placeholder="Nhập loại cây..."
                required
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Giống Cây
              </p>
              <input 
                type="text"
                name="name"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                placeholder="Nhập giống cây..."
                required
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Diện Tích
              </p>
              <input 
                type="text"
                name="area"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                placeholder="Nhập diện tích..."
                required
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Vị Trí Ruộng
              </p>
              <div className="w-full">
                <MapPicker onAddressFound={handleMapSelect} />
              </div>
            </div>
          </div>

          {/* Hidden inputs để lưu tọa độ */}
          <input type="hidden" name="latitude" value={locationData.latitude} />
          <input type="hidden" name="longitude" value={locationData.longitude} />

          {/* Hiển thị tọa độ đã chọn (optional - có thể ẩn) */}
          {locationData.latitude && locationData.longitude && (
            <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
              <div className="flex gap-[15px] items-center w-full">
                <div className="flex-1">
                  <p className="text-sm font-['Be_Vietnam_Pro'] text-gray-600">
                    Vĩ độ: <span className="font-semibold text-[#191f19]">{parseFloat(locationData.latitude).toFixed(6)}</span>
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-['Be_Vietnam_Pro'] text-gray-600">
                    Kinh độ: <span className="font-semibold text-[#191f19]">{parseFloat(locationData.longitude).toFixed(6)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="box-border flex flex-col gap-[10px] items-start px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Ngày Trồng
              </p>
              <input 
                type="date"
                name="planting_date"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                required
              />
            </div>
          </div>

          <div className="box-border flex flex-col gap-[10px] items-center px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                Ngày Thu Hoạch Dự Kiến
              </p>
              <input 
                type="date"
                name="expected_harvest_date"
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                required
              />
            </div>

            <div className="h-[15px] w-[36px] opacity-0" />
            
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[15px] md:gap-[20px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] flex-1 hover:bg-[#d5e5d1] transition-colors"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#191f19]">
                  Hủy
                </p>
              </button>
              
              <button
                type="submit"
                className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] flex-1 hover:bg-[#267019] transition-colors"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                  Xác Nhận
                </p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
