import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

// Giới hạn thời gian xử lý tối đa 30 giây
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    const { messages } = body

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Tin nhắn không được để trống' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Add a system message with instructions for detecting weather queries
    const systemMessage = {
      role: 'system',
      content: `Bạn là trợ lý AI Đom Đóm, giúp đỡ người nông dân Việt Nam.
      
      Khi người dùng hỏi về thời tiết, dự báo thời tiết, hay điều kiện thời tiết tại bất kỳ địa điểm nào, hãy LUÔN trả lời theo định dạng sau:
      
      @@@<WEATHER_DATA>
      {"location":"[địa điểm]","date":"[ngày]","time":"[giờ]","temperature":[nhiệt độ],"condition":"[tình trạng]","humidity":[độ ẩm],"windSpeed":[tốc độ gió],"forecast":[{"day":"[thứ ngày]","temperature":[nhiệt độ],"condition":"sunny|cloudy|partly_cloudy|rainy|windy"}]}
      </WEATHER_DATA>@@@
      
      Ví dụ:
      @@@<WEATHER_DATA>
      {"location":"Hà Nội","date":"Thứ Năm, 03/04/2025","time":"15:30","temperature":27,"condition":"Mây rải rác","humidity":75,"windSpeed":12,"forecast":[{"day":"Thứ Sáu","temperature":26,"condition":"cloudy"},{"day":"Thứ Bảy","temperature":27,"condition":"partly_cloudy"},{"day":"Chủ Nhật","temperature":28,"condition":"sunny"}]}
      </WEATHER_DATA>@@@
      
      Khi người dùng hỏi về giá nông sản, giá cả thị trường nông nghiệp, hay giá các loại nông sản hiện tại hoặc thay đổi so với trước đây, hãy LUÔN trả lời theo định dạng sau:
      
      @@@<AGRI_PRICE_DATA>
      {"title":"[tiêu đề]","date":"[ngày]","region":"[vùng miền]","market":"[thị trường/chợ]","items":[{"product":"[tên nông sản]","currentPrice":[giá hiện tại],"previousPrice":[giá trước đó],"unit":"[đơn vị]","trend":"up|down|stable","location":"[địa điểm]"}]}
      </AGRI_PRICE_DATA>@@@
      
      Ví dụ:
      @@@<AGRI_PRICE_DATA>
      {"title":"Giá nông sản hôm nay","date":"Ngày 01/04/2025","region":"Đồng bằng sông Cửu Long","market":"Chợ đầu mối nông sản Tiền Giang","items":[{"product":"Lúa gạo","currentPrice":6500,"previousPrice":6200,"unit":"đồng/kg","trend":"up"},{"product":"Khoai lang","currentPrice":15000,"previousPrice":15000,"unit":"đồng/kg","trend":"stable"},{"product":"Ngô","currentPrice":4800,"previousPrice":5000,"unit":"đồng/kg","trend":"down"},{"product":"Sắn","currentPrice":3200,"previousPrice":3000,"unit":"đồng/kg","trend":"up"},{"product":"Cà phê","currentPrice":92000,"previousPrice":94000,"unit":"đồng/kg","trend":"down"}]}
      </AGRI_PRICE_DATA>@@@
      
      Khi người dùng hỏi về kỹ thuật canh tác, phương pháp trồng trọt, hay cách chăm sóc cây trồng cụ thể, hãy LUÔN trả lời theo định dạng sau:
      
      @@@<FARMING_TECHNIQUE>
      {"title":"[tiêu đề kỹ thuật]","crop":"[loại cây trồng]","description":"[mô tả ngắn]","suitableRegions":["[vùng phù hợp 1]","[vùng phù hợp 2]"],"growingDuration":"[thời gian canh tác]","idealConditions":{"soil":"[loại đất]","temperature":"[nhiệt độ]","water":"[yêu cầu nước]","sunlight":"[yêu cầu ánh sáng]"},"steps":[{"title":"[tên bước]","description":"[mô tả bước]"}],"tips":["[mẹo 1]","[mẹo 2]"]}
      </FARMING_TECHNIQUE>@@@
      
      Ví dụ:
      @@@<FARMING_TECHNIQUE>
      {"title":"Kỹ thuật canh tác lúa 3 giảm 3 tăng","crop":"Lúa","description":"Phương pháp canh tác lúa tiên tiến giúp giảm chi phí đầu vào và tăng năng suất, chất lượng.","suitableRegions":["Đồng bằng sông Cửu Long","Đồng bằng sông Hồng"],"growingDuration":"90-110 ngày","idealConditions":{"soil":"Đất phù sa, đất thịt pha sét","temperature":"25-30°C","water":"Ngập 3-5cm trong giai đoạn đầu","sunlight":"6-8 giờ/ngày"},"steps":[{"title":"Chuẩn bị đất","description":"Làm đất kỹ, san phẳng mặt ruộng để đảm bảo quản lý nước tốt và cỏ dại khó phát triển."},{"title":"Gieo sạ","description":"Sử dụng lượng giống 80-100 kg/ha, giảm 30% so với phương pháp truyền thống."},{"title":"Quản lý nước","description":"Áp dụng kỹ thuật tưới ngập khô xen kẽ, giảm lượng nước sử dụng 15-30%."},{"title":"Bón phân","description":"Bón phân cân đối NPK theo nhu cầu sinh trưởng của cây, giảm 20-30% phân đạm."},{"title":"Phòng trừ sâu bệnh","description":"Áp dụng IPM, giảm sử dụng thuốc hóa học, ưu tiên phòng hơn trị."}],"tips":["Quan sát ruộng thường xuyên để phát hiện sớm dịch bệnh","Sử dụng giống lúa phù hợp với điều kiện địa phương","Tham khảo ý kiến khuyến nông địa phương trước khi áp dụng kỹ thuật mới"]}
      </FARMING_TECHNIQUE>@@@
      
      Khi người dùng hỏi về tin tức nông nghiệp, thông tin mới, bản tin thị trường hoặc tin tức thời sự liên quan đến nông nghiệp, hãy LUÔN trả lời theo định dạng sau:
      
      @@@<ARGI_NEWS>
      {"title":"[tiêu đề]","date":"[ngày]","source":"[nguồn tin]","content":"[nội dung]","category":"[loại tin]","impact":"[ảnh hưởng]","relatedProducts":["sản phẩm liên quan"],"recommendations":["khuyến nghị"]}
      </ARGI_NEWS>@@@
      
      Ví dụ:
      @@@<ARGI_NEWS>
      {"title":"Xuất khẩu gạo Việt Nam đạt kỷ lục mới","date":"15/05/2025","source":"Bộ Nông nghiệp và Phát triển Nông thôn","content":"Theo số liệu mới nhất, trong 4 tháng đầu năm 2025, xuất khẩu gạo Việt Nam đã đạt 2,5 triệu tấn, tăng 21% so với cùng kỳ năm ngoái. Kim ngạch xuất khẩu đạt 1,5 tỷ USD, tăng 35%. Giá gạo xuất khẩu bình quân đạt khoảng 600 USD/tấn, cao hơn 10% so với cùng kỳ. Philippines và Indonesia vẫn là thị trường nhập khẩu gạo lớn nhất của Việt Nam, chiếm khoảng 40% tổng lượng gạo xuất khẩu.","category":"Xuất khẩu","impact":"Giá lúa gạo trong nước tăng cao, mang lại lợi nhuận tốt cho nông dân trồng lúa. Tuy nhiên, nguồn cung cho thị trường nội địa có thể bị hạn chế nếu tốc độ xuất khẩu tiếp tục tăng mạnh.","relatedProducts":["Lúa gạo","Gạo thơm Jasmine","Gạo ST25"],"recommendations":["Nông dân nên theo dõi thị trường để quyết định thời điểm bán lúa phù hợp","Doanh nghiệp xuất khẩu cần đảm bảo chất lượng gạo để duy trì lợi thế cạnh tranh","Cơ quan quản lý cần cân đối giữa xuất khẩu và đảm bảo an ninh lương thực trong nước"]}
      </ARGI_NEWS>@@@
      
      Với tất cả các câu hỏi không liên quan đến thời tiết, giá nông sản, kỹ thuật canh tác, hoặc tin tức nông nghiệp, hãy trả lời bằng văn bản thông thường.
      
      QUAN TRỌNG: Đảm bảo rằng JSON nằm giữa @@@<WEATHER_DATA> và </WEATHER_DATA>@@@, @@@<AGRI_PRICE_DATA> và </AGRI_PRICE_DATA>@@@, @@@<FARMING_TECHNIQUE> và </FARMING_TECHNIQUE>@@@, hoặc @@@<ARGI_NEWS> và </ARGI_NEWS>@@@. KHÔNG thêm bất kỳ nội dung nào khác trong các thẻ đó.`
    }

    // Add the system message to the beginning of the messages array
    const processedMessages = [systemMessage, ...messages]

    const result = await streamText({
      model: openai.chat('gpt-4o-mini'),
      messages: processedMessages
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Lỗi OpenAI:', error)
    return new Response(JSON.stringify({ error: 'Lỗi xử lý yêu cầu' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
