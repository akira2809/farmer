import { TFarm, TCreateFarm } from "@/models/farm";
import { updateFarmAction } from "@/action/farm";

async function handleUpdateField(id: string, fieldData: Partial<TCreateFarm>): Promise<TFarm | null> {
    try {
        const result = await updateFarmAction(id, fieldData);
        return result;
    } catch (error) {
        console.error('Error updating field:', error);
        return null;
    }
}

interface EditFieldModalProps {
    showModal: boolean;
    onClose: () => void;
    farm: TFarm | null;
}

export default function EditFieldModal({ showModal, onClose, farm }: EditFieldModalProps) {
    if (!showModal || !farm) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);

        const fieldData: Partial<TCreateFarm> = {
            crop_type: data.get('crop_type') as string,
            name: data.get('name') as string,
            area: data.get('area') as string,
            planting_date: data.get('planting_date') as string,
            expected_harvest_date: data.get('expected_harvest_date') as string,
        };

        const result = await handleUpdateField(farm.id, fieldData);
        if (result) {
            onClose();
            window.location.reload();
        } else {
            alert('Có lỗi xảy ra khi cập nhật ruộng. Vui lòng thử lại.');
        }
    };

    // Helper to format date for input
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white box-border flex flex-col gap-[25px] md:gap-[30px] items-start justify-center pb-[40px] md:pb-[50px] pt-[60px] md:pt-[80px] px-0 relative rounded-[18px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="flex gap-[20px] md:gap-[30px] items-center justify-center relative shrink-0 w-full">
                    <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[36px] md:text-[48px] text-black text-center">
                        Sửa Thông Tin Ruộng
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-[25px] w-full" key={farm.id}>
                    <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
                        <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                            <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                                Loại Cây
                            </p>
                            <input
                                type="text"
                                name="crop_type"
                                defaultValue={farm.crop_type}
                                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                                placeholder="Nhập loại cây..."
                                required
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
                                name="name"
                                defaultValue={farm.name}
                                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                                placeholder="Nhập giống cây..."
                                required
                            />
                        </div>
                    </div>

                    <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[70px] py-0 relative shrink-0 w-full">
                        <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                            <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[18px] md:text-[20px] text-[#191f19] w-full">
                                Diện Tích (m²)
                            </p>
                            <input
                                type="number"
                                name="area"
                                defaultValue={farm.area}
                                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                                placeholder="Nhập diện tích..."
                                required
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
                                name="planting_date"
                                defaultValue={formatDate(farm.planting_date)}
                                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] rounded-[18px] shrink-0 w-full px-4 outline-none focus:border-2"
                                required
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
                                name="expected_harvest_date"
                                defaultValue={formatDate(farm.expected_harvest_date)}
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
                                    Cập Nhật
                                </p>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
