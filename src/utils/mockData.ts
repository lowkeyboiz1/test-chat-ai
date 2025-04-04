import { LandPlot } from "@/types"

export const landPlots: LandPlot[] = [
  {
    id: "plot1",
    name: "Thửa ruộng Đông",
    area: "1.5 ha",
    location: "Đông Tháp - Khu A",
    crops: [{ name: "Lúa mùa thu", progress: 65, nextAction: "Phun thuốc trừ sâu", daysRemaining: 3 }],
  },
  {
    id: "plot2",
    name: "Thửa vườn Tây",
    area: "0.3 ha",
    location: "Đông Tháp - Khu B",
    crops: [{ name: "Rau muống", progress: 85, nextAction: "Thu hoạch", daysRemaining: 1 }],
  },
  {
    id: "plot3",
    name: "Thửa đất Nam",
    area: "0.5 ha",
    location: "Đông Tháp - Khu C",
    crops: [{ name: "Cà chua", progress: 40, nextAction: "Tưới nước", daysRemaining: 0 }],
  },
]

export const recentTopics = ["Phòng trừ sâu bệnh", "Dự báo thời tiết", "Kỹ thuật canh tác lúa", "Giá nông sản"]
export const suggestedQuestions = ["Làm thế nào để tăng năng suất lúa?", "Khi nào nên thu hoạch rau muống?", "Dự báo thời tiết tuần tới?", "Cách phòng trừ sâu đục thân?"]

export const aiResponses = [
  "Để tăng năng suất lúa, anh nên chú ý đến việc chọn giống phù hợp với điều kiện thổ nhưỡng và thời tiết khu vực của anh. Giống lúa ST25 hoặc OM5451 có thể phù hợp với vùng của anh.",
  "Dựa vào dữ liệu thời tiết và lịch canh tác của anh, tôi khuyên anh nên phun thuốc trừ sâu cho lúa trong 3 ngày tới trước khi có mưa lớn vào cuối tuần.",
  "Theo dõi của tôi về ruộng rau muống của anh, đã đến lúc thu hoạch rồi đấy! Nên thu vào buổi sáng sớm để đảm bảo độ tươi ngon nhất.",
  "Tôi thấy anh đang gặp vấn đề với sâu đục thân trên cây lúa. Tôi đề xuất sử dụng thuốc sinh học Bacillus thuringiensis với liều lượng 1kg/ha, phun vào buổi chiều mát.",
]
