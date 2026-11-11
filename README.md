# Chuyển Xanh

**Hiểu quy định vùng phát thải thấp Hà Nội trong 30 giây, và tìm cách chuyển đổi rẻ nhất cho bạn.**

🔗 **Demo:** https://lenaho-jenia.github.io/chuyen-xanh/

> Bản thử nghiệm (MVP). Không thay thế văn bản pháp lý.

<!-- Sau khi đưa web lên mạng, chụp màn hình trang và lưu vào docs/screenshots/kiem-tra.png, rồi thay dòng này bằng: ![Ảnh chụp màn hình](docs/screenshots/kiem-tra.png) -->

---

## Vấn đề

Từ 1/7/2026, Hà Nội thí điểm vùng phát thải thấp trong Vành đai 1, với lộ trình siết dần đến năm 2028. Quy định khác nhau theo **khu vực**, **loại xe**, **khung giờ** và **năm**, nằm rải rác trong nhiều văn bản và đã được điều chỉnh nhiều lần trước khi áp dụng. Người dân, nhất là shipper, tài xế công nghệ và tiểu thương, khó biết chính xác mình bị ảnh hưởng thế nào và nên chuyển đổi ra sao.

## Người dùng

- Shipper, tài xế xe ôm công nghệ chạy xe máy xăng
- Tiểu thương, cư dân trong 9 phường thuộc Vành đai 1
- Người dân Hà Nội cần chuẩn bị trước cho giai đoạn mở rộng 2027, 2028

## Pain points (giả thuyết, đang kiểm chứng bằng phỏng vấn)

| Pain point | Mức độ |
| --- | --- |
| Không biết đi vào khu vực nào, giờ nào thì bị hạn chế | Cao |
| Không biết đổi sang xe điện thì bao lâu hoàn vốn | Cao |
| Không biết mình có được hỗ trợ không, cần giấy tờ gì | Trung bình |
| Thông tin trên báo chí mâu thuẫn, văn bản khó đọc | Cao |

<!-- Sau khi phỏng vấn, thay bảng trên bằng kết quả thật: số người đã hỏi, câu trích dẫn, pain point được xác nhận. -->

## Giải pháp

| Tính năng | Mô tả | Trạng thái |
| --- | --- | --- |
| **Kiểm tra 30 giây** | Chọn loại xe, ngày giờ và điểm đến → biết ngay được đi hay không, kèm căn cứ và lộ trình 2026 – 2028 | ✅ Chạy thật |
| **Bản đồ chọn điểm đến** | Chạm vào bản đồ, gõ tên phố hoặc dùng vị trí hiện tại; trang tự xác định Khu vực 1, 2, 3 hay Vành đai 1 | ✅ Chạy thật, ranh giới gần đúng |
| **Chi phí chuyển đổi** | So sánh xe xăng, xe máy điện, xe buýt/metro; tính cả thuê pin, hỗ trợ, bán xe cũ; ra số tháng hoàn vốn | ✅ Chạy thật, giá mẫu cần cập nhật |
| **Hỗ trợ đổi xe** | Điều kiện theo Nghị quyết 68/2026/NQ-HĐND và danh sách giấy tờ cần giữ | ✅ Chạy thật |
| **Hỏi đáp** | 11 câu hỏi thường gặp, mỗi câu trả lời kèm căn cứ và link nguồn | ✅ Chạy thật |
| **Người dân đang hỏi gì** | Tổng hợp ẩn danh câu hỏi người dân gửi về cho phường và các sở | 🟡 Đang thu thập dữ liệu |
| **Trợ lý hỏi đáp** | Khung chat tìm câu trả lời trong kho quy định, luôn trích nguồn, nói rõ khi chưa có căn cứ thay vì đoán | ✅ Chạy thật (tìm kiếm theo từ khóa, chưa dùng AI) |
| **Lưu ảnh kết quả** | Tạo ảnh 4:5 của kết quả tra cứu để chia sẻ Facebook, Zalo | ✅ Chạy thật |
| **Nhắc trước mốc mới** | Tải file lịch .ics, nhắc trước 7 ngày các mốc 1/1/2027 và 1/1/2028 cho đúng xe và khu vực đã tra | ✅ Chạy thật |
| Trợ lý AI qua Zalo | Mô hình ngôn ngữ trả lời theo Điều, Khoản của văn bản gốc | ⏳ Bước tiếp theo |

## Học hỏi từ các dự án quốc tế

- **London (TfL ULEZ):** công cụ kiểm tra xe chỉ một câu hỏi được dùng nhiều nhất → "Kiểm tra 30 giây" là cửa chính.
- **Đài Loan:** thuê pin và cộng dồn trợ cấp quyết định chi phí thật → máy tính chi phí tính cả hai.
- **PolicyBot, CivicBridge, LawKo:** chatbot chính sách phải trích nguồn và biết nói "chưa có thông tin" → mọi câu trả lời đều có căn cứ.

## Nguyên tắc

1. **Mọi thông tin đều có nguồn.** Xem [`SOURCES.md`](SOURCES.md).
2. **Không chắc thì nói không chắc.** Ví dụ: thủ tục nhận hỗ trợ vẫn là dự thảo, nên trang ghi rõ như vậy.
3. **Không thu thập dữ liệu cá nhân.** Trang không có tài khoản, không lưu thông tin người dùng lên máy chủ.

## Giới hạn hiện tại

- Ranh giới các khu vực trên bản đồ vẽ gần đúng theo danh sách phố bao quanh mà báo chí công bố, chưa phải dữ liệu chính thức. Ở sát ranh giới cần đối chiếu bản đồ của thành phố.
- Giá xăng, giá điện, giá xe trong máy tính chi phí là số mẫu.
- Chưa bao gồm chi tiết đầy đủ cho xe tải và xe khách.

## Chạy thử trên máy

Chỉ cần mở file `index.html` bằng trình duyệt. Không cần cài đặt gì.

## Công nghệ

HTML, CSS, JavaScript thuần. Bản đồ: Leaflet, nền bản đồ OpenStreetMap và CARTO, tìm địa chỉ bằng Nominatim. Triển khai miễn phí bằng GitHub Pages.

## Tác giả

Hồ Lê Na · [GitHub](https://github.com/LenaHo-Jenia)

## Ảnh

- Cầu Thê Húc, Hồ Gươm: [Harry Tran](https://unsplash.com/photos/red-bridge-over-river-surrounded-by-trees-7oAFzGyemco) / Unsplash
- Phố Hà Nội: [Elliot Andrews](https://unsplash.com/photos/people-riding-motorcycle-on-road-near-building-during-daytime-6keOhd7idJo) / Unsplash

Ảnh dùng theo [Giấy phép Unsplash](https://unsplash.com/license).

## Giấy phép

Mã nguồn: MIT
