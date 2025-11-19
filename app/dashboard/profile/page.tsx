"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { actionLogout, actionGetProfile, actionUpdateProfile } from "@/action/auth";
import { User } from "@/models/user";
import { toast } from "sonner";

const imgImage10 = "https://www.figma.com/api/mcp/asset/2c86edef-cc3f-4608-951a-cd71a71e873c";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    province: "",
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await actionGetProfile();
        if (result.success && result.data) {
          setUser(result.data);
          setFormData({
            full_name: result.data.full_name,
            province: result.data.province,
          });
        } else {
          toast.error(result.error || "Không thể tải thông tin hồ sơ");
        }
      } catch (error) {
        console.error("Load profile error:", error);
        toast.error("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.province.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSaving(true);
    try {
      const result = await actionUpdateProfile(formData);
      if (result.success) {
        toast.success(result.message || "Cập nhật hồ sơ thành công");
        if (result.data) {
          setUser(result.data);
        }
      } else {
        toast.error(result.error || "Cập nhật hồ sơ thất bại");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await actionLogout();
      toast.success("Đăng xuất thành công");
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/signin");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fffcf6] flex items-center justify-center min-h-screen">
        <p className="text-[#2e8623] text-xl">Đang tải...</p>
      </div>
    );
  }

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
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
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
                value={user?.phone || ""}
                disabled
                className="bg-[#ebf5ed] border border-[#2e8623] border-solid h-[55px] opacity-50 rounded-[18px] shrink-0 w-full px-4 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Change Password Link */}
          <div className="box-border flex flex-col gap-[10px] items-start overflow-clip px-[50px] md:px-[185px] py-0 relative shrink-0 w-full">
            <button
              onClick={() => router.push("/dashboard/profile/change-password")}
              className="text-[#2e8623] font-['Be_Vietnam_Pro'] font-semibold text-[16px] md:text-[18px] hover:underline"
            >
              Đổi mật khẩu →
            </button>
          </div>

          {/* Buttons */}
          <div className="box-border flex flex-col gap-[10px] items-start pb-0 pt-[16px] px-0 relative shrink-0 w-full">
            <div className="box-border flex flex-col gap-[10px] items-start px-[100px] md:px-[300px] py-0 relative shrink-0 w-full">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#2e8623] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] h-[60px] md:h-[71px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] shrink-0 w-full hover:bg-[#267019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                  {saving ? "Đang lưu..." : "Lưu Thông Tin"}
                </p>
              </button>
            </div>
            <div className="box-border flex flex-col gap-[10px] items-start px-[100px] md:px-[300px] py-0 relative shrink-0 w-full">
              <button
                onClick={handleLogout}
                className="bg-[#dc2626] border border-[#fffcf6] border-solid box-border flex gap-[15px] md:gap-[20px] h-[60px] md:h-[71px] items-center justify-center px-[20px] md:px-[25px] py-[16px] md:py-[20px] relative rounded-[20px] shrink-0 w-full hover:bg-[#b91c1c] transition-colors"
              >
                <p className="capitalize font-['Be_Vietnam_Pro'] font-semibold leading-[normal] relative shrink-0 text-[17px] md:text-[20px] text-[#ebf5ed]">
                  Đăng Xuất
                </p>
              </button>
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
