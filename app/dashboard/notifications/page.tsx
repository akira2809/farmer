"use client";

import Sidebar from "../Sidebar";
import { AlertCircle, CheckCircle, Info, CloudRain } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Cảnh Báo Thời Tiết",
      message: "Sắp tới sẽ có mưa to trong vòng 2-3 ngày, bạn hãy chú ý bảo vệ các cây trồng của mình.",
      time: "2 giờ trước",
      icon: CloudRain,
      bgColor: "bg-[#ffd2d2]",
    },
    {
      id: 2,
      type: "success",
      title: "Cập Nhật Thành Công",
      message: "Thông tin ruộng Lúa 1 đã được cập nhật thành công.",
      time: "5 giờ trước",
      icon: CheckCircle,
      bgColor: "bg-[#b5d5b1]",
    },
    {
      id: 3,
      type: "info",
      title: "Lời Khuyên Từ Bác Sĩ Cây",
      message: "Đã đến thời gian bón phân cho ruộng Lúa 2. Hãy sử dụng phân NPK với tỷ lệ phù hợp.",
      time: "1 ngày trước",
      icon: Info,
      bgColor: "bg-[#d4e8ff]",
    },
    {
      id: 4,
      type: "alert",
      title: "Phát Hiện Bệnh",
      message: "Ruộng Lúa 1 có dấu hiệu bị bệnh. Vui lòng kiểm tra và điều trị kịp thời.",
      time: "2 ngày trước",
      icon: AlertCircle,
      bgColor: "bg-[#ffd2d2]",
    },
    {
      id: 5,
      type: "info",
      title: "Nhắc Nhở Tưới Nước",
      message: "Hôm nay là ngày tưới nước cho ruộng Lúa 3 theo lịch trình của bạn.",
      time: "3 ngày trước",
      icon: Info,
      bgColor: "bg-[#d4e8ff]",
    },
  ];

  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="notifications" />

      <div className="flex flex-[1_0_0] flex-col gap-[25px] md:gap-[30px] items-center min-h-screen w-full max-w-full relative pb-20 md:pb-8 overflow-x-hidden md:ml-[60px] lg:ml-[72px]">
        <div className="box-border flex flex-col gap-[18px] md:gap-[22px] items-center justify-center px-[20px] md:px-[40px] lg:px-[60px] py-0 relative shrink-0 w-full max-w-full pt-6 md:pt-8">
          <div className="bg-transparent h-[50px] md:h-[60px] shrink-0 w-full" />
          <p className="capitalize font-['Playfair_Display'] font-semibold leading-[normal] relative shrink-0 text-[28px] md:text-[36px] text-black text-center w-full">
            Thông Báo
          </p>

          {/* Notifications List */}
          <div className="flex flex-col gap-[15px] md:gap-[20px] items-start relative shrink-0 w-full max-w-[900px]">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`${notification.bgColor} box-border flex gap-[15px] md:gap-[20px] items-start px-[20px] md:px-[30px] py-[18px] md:py-[25px] relative rounded-[18px] shrink-0 w-full hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start justify-center pt-1 shrink-0">
                    <Icon className="size-[24px] md:size-[30px] text-[#191f19]" />
                  </div>
                  <div className="flex flex-col gap-[8px] md:gap-[10px] flex-1">
                    <div className="flex items-start justify-between gap-3 w-full">
                      <p className="font-['Be_Vietnam_Pro'] font-semibold leading-[1.3] text-[18px] md:text-[22px] text-black flex-1">
                        {notification.title}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] leading-[normal] text-[12px] md:text-[14px] text-black opacity-60 shrink-0">
                        {notification.time}
                      </p>
                    </div>
                    <p className="font-['Be_Vietnam_Pro'] leading-[1.5] text-[14px] md:text-[16px] text-black">
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State (when no notifications) */}
          {notifications.length === 0 && (
            <div className="flex flex-col gap-[20px] items-center justify-center py-[80px] w-full">
              <div className="opacity-30">
                <Info className="size-[80px] text-[#2e8623]" />
              </div>
              <p className="font-['Be_Vietnam_Pro'] font-semibold text-[20px] md:text-[24px] text-black text-center">
                Không có thông báo nào
              </p>
              <p className="font-['Be_Vietnam_Pro'] text-[16px] md:text-[18px] text-black text-center opacity-60">
                Bạn sẽ nhận được thông báo khi có cập nhật mới
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
