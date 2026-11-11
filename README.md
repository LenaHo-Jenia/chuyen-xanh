# Chuyển Xanh

**Tra cứu quy định vùng phát thải thấp Hà Nội cho đúng chiếc xe, đúng nơi, đúng giờ của bạn, và tìm cách chuyển sang phương tiện xanh với chi phí thấp nhất.**

[Dùng thử](https://lenaho-jenia.github.io/chuyen-xanh/) · [Nguồn dữ liệu](SOURCES.md) · [Giấy phép MIT](LICENSE)

> Trạng thái: bản Beta. Thông tin chỉ để tham khảo, không thay thế văn bản pháp lý.

<!-- Sau khi đưa web lên mạng, chụp màn hình trang và lưu vào docs/screenshots/kiem-tra.png, rồi thay dòng này bằng: ![Ảnh chụp màn hình](docs/screenshots/kiem-tra.png) -->

---

## Mục lục

1. [Bối cảnh](#bối-cảnh)
2. [Phát biểu vấn đề](#phát-biểu-vấn-đề)
3. [Người dùng và điểm đau](#người-dùng-và-điểm-đau)
4. [Giải pháp](#giải-pháp)
5. [Tính năng](#tính-năng)
6. [Nguyên tắc thiết kế](#nguyên-tắc-thiết-kế)
7. [Giới hạn hiện tại](#giới-hạn-hiện-tại)
8. [Đo lường hiệu quả](#đo-lường-hiệu-quả)
9. [Lộ trình](#lộ-trình)
10. [Công nghệ và cách chạy](#công-nghệ-và-cách-chạy)
11. [Cập nhật dữ liệu](#cập-nhật-dữ-liệu)
12. [Ghi công và giấy phép](#ghi-công-và-giấy-phép)

---

## Bối cảnh

Năm 2024, nồng độ bụi mịn PM2.5 trung bình ở Hà Nội là **45,4 µg/m³**, cao hơn 9 lần mức WHO khuyến nghị. Mức trung bình cả nước là 28,7 µg/m³. Ô nhiễm không khí liên quan đến ít nhất **70.000 ca tử vong mỗi năm** ở Việt Nam, với thiệt hại kinh tế ước tính hơn **13 tỷ USD mỗi năm**, khoảng 4% GDP.

Giao thông là một trong những nguồn phát thải chính ở đô thị. Từ **1/7/2026**, Hà Nội thí điểm vùng phát thải thấp trong Vành đai 1, theo lộ trình siết dần:

| Giai đoạn | Thời gian | Thay đổi chính |
| --- | --- | --- |
| 1 | 1/7 – 31/12/2026 | Khu vực 1 (quanh Hồ Gươm) cấm mọi phương tiện 19h–24h thứ Sáu đến Chủ nhật. Xe máy xăng chạy ứng dụng và xe cũ thuộc diện khuyến khích hạn chế. |
| 2 | Năm 2027 | Xe máy xăng chạy ứng dụng không được vào các khu vực thuộc phường Hoàn Kiếm, Cửa Nam. Ô tô phải đạt chuẩn khí thải mức 4. |
| 3 | Từ 1/1/2028 | Xe máy trong toàn Vành đai 1 phải đạt chuẩn khí thải mức 3. |

Nguồn chi tiết ở [SOURCES.md](SOURCES.md).

## Phát biểu vấn đề

> **Người đi xe máy, tài xế công nghệ và tiểu thương trong Vành đai 1** cần biết **chính xác quy định áp dụng cho phương tiện của mình tại nơi và thời điểm cụ thể**, cùng **phương án chuyển đổi phù hợp với túi tiền**. Hiện nay, quy định khác nhau theo khu vực, loại xe, khung giờ và từng năm, nằm rải rác trong nhiều văn bản hành chính và đã được điều chỉnh nhiều lần. Hiểu sai dẫn đến bị phạt, mất thu nhập hoặc đầu tư nhầm phương tiện. Về phía chính quyền, chưa có kênh tổng hợp để biết người dân đang hiểu sai điều gì.

**Câu hỏi định hướng:** Làm thế nào để một người đi xe máy ở Hà Nội biết trong 30 giây rằng chuyến đi của mình có bị hạn chế không, và chuyển sang phương tiện xanh thì tốn bao nhiêu?

## Người dùng và điểm đau

Bảng dưới đây là **giả thuyết ban đầu**, đang được kiểm chứng qua phỏng vấn và biểu mẫu thu câu hỏi. Cột "Trạng thái" sẽ được cập nhật theo dữ liệu thật.

| Nhóm người dùng | Điểm đau | Hệ quả | Mức độ | Trạng thái |
| --- | --- | --- | --- | --- |
| Shipper, tài xế công nghệ | Không biết khu vực, khung giờ nào bị hạn chế với xe của mình | Từ chối đơn hoặc chịu rủi ro bị phạt | Cao | Giả thuyết |
| Shipper, tài xế công nghệ | Không biết đổi sang xe điện bao lâu hoàn vốn, đổi pin ở đâu | Trì hoãn chuyển đổi đến sát hạn | Cao | Giả thuyết |
| Tiểu thương khu trung tâm | Chưa rõ ảnh hưởng tới việc nhập hàng và khách đến cửa hàng | Khó lên kế hoạch kinh doanh | Trung bình | Giả thuyết |
| Cư dân Vành đai 1 | Không chắc nơi mình ở thuộc khu vực nào, có được hỗ trợ không | Bỏ lỡ hỗ trợ hoặc chuẩn bị sai giấy tờ | Trung bình | Giả thuyết |
| Mọi nhóm | Thông tin trên báo chí thay đổi, văn bản khó đọc | Mất niềm tin, làm theo tin đồn | Cao | Giả thuyết |
| Chính quyền phường, sở | Không có dữ liệu về những điểm người dân đang hiểu sai | Truyền thông chính sách thiếu trọng tâm | Trung bình | Giả thuyết |

## Giải pháp

Chuyển Xanh là một trang web chạy ngay trên điện thoại, không cần cài đặt hay tạo tài khoản. Thông tin đi theo hai chiều:

```
Văn bản quy định ──► Chuyển Xanh ──► Câu trả lời cho đúng trường hợp của người dân
                         ▲
Câu hỏi của người dân ───┘──► Bảng tổng hợp ẩn danh cho phường và các sở
```

1. **Tra cứu:** người dùng chọn loại xe, chạm vào điểm đến trên bản đồ và chọn giờ. Kết quả cho biết được đi, khuyến khích hạn chế, có điều kiện hay không được đi, kèm căn cứ và lộ trình đến 2028.
2. **Tính chi phí:** so sánh chi phí hằng tháng giữa giữ xe xăng, chuyển sang xe máy điện và đi xe buýt, metro, có tính tiền thuê pin, tiền hỗ trợ và thời gian hòa vốn.
3. **Hỏi đáp:** trả lời theo văn bản, luôn trích nguồn, nói rõ khi chưa có quy định.
4. **Phản hồi ngược:** câu hỏi được thống kê ẩn danh theo chủ đề, cho thấy quy định nào đang gây nhầm lẫn.

## Tính năng

| Tính năng | Mô tả | Trạng thái |
| --- | --- | --- |
| Tra nhanh 30 giây | Kết quả theo loại xe, khu vực, ngày giờ; kèm căn cứ và lộ trình 2026–2028 | Hoạt động |
| Bản đồ chọn điểm đến | Chạm bản đồ, tìm tên phố hoặc dùng vị trí hiện tại; tự xác định Khu vực 1, 2, 3 hay Vành đai 1 | Hoạt động, ranh giới gần đúng |
| Mô phỏng bụi mịn | Ảnh đường phố phủ lớp mù theo mức PM2.5: chuẩn WHO, cả nước, Hà Nội | Hoạt động, chỉ để minh họa |
| Chi phí chuyển đổi | So sánh xe xăng, xe điện, xe buýt và metro; tính thuê pin, hỗ trợ, bán xe cũ, thời gian hòa vốn | Hoạt động |
| Hỗ trợ đổi xe | Điều kiện theo Nghị quyết 68/2026/NQ-HĐND và danh sách giấy tờ cần giữ | Hoạt động |
| Hỏi đáp | Câu hỏi thường gặp có tìm kiếm, mỗi câu kèm căn cứ | Hoạt động |
| Trợ lý hỏi đáp | Khung chat tìm câu trả lời trong kho quy định, trích nguồn, từ chối khi thiếu căn cứ | Hoạt động, tìm theo từ khóa |
| Lưu ảnh kết quả | Ảnh khổ 4:5 để chia sẻ Facebook, Zalo | Hoạt động |
| Nhắc trước mốc mới | File lịch .ics nhắc trước 7 ngày các mốc 1/1/2027 và 1/1/2028 | Hoạt động |
| Câu hỏi nổi bật | Thống kê ẩn danh câu hỏi người dân gửi về theo tuần | Đang thu thập dữ liệu |

## Nguyên tắc thiết kế

1. **Mọi thông tin đều có nguồn.** Mỗi kết quả và câu trả lời ghi rõ căn cứ, kèm link.
2. **Không chắc thì nói không chắc.** Thủ tục còn là dự thảo, ranh giới chưa có dữ liệu chính thức, câu hỏi ngoài phạm vi: trang đều nói rõ thay vì đoán.
3. **Không thu thập dữ liệu cá nhân.** Không tài khoản, không lưu tên, số điện thoại hay vị trí lên máy chủ. Vị trí hiện tại chỉ dùng trên máy người dùng để xác định khu vực.
4. **Viết cho người bận rộn.** Ngôn ngữ đời thường, thiết kế cho điện thoại trước, câu trả lời ngắn và đi thẳng vào trường hợp cụ thể.
5. **Không thay thế chính quyền.** Văn bản chính thức của thành phố luôn là căn cứ cuối cùng.

## Giới hạn hiện tại

- **Ranh giới khu vực trên bản đồ là gần đúng.** Ranh giới được vẽ theo danh sách phố bao quanh mà báo chí công bố. Ở sát ranh giới, người dùng cần đối chiếu bản đồ chính thức.
- **Trợ lý hỏi đáp chưa dùng AI.** Trợ lý chỉ trả lời được những gì đã có trong kho quy định.
- **Giá xăng, điện, xe điện và vé xe buýt là số mẫu.** Người dùng có thể sửa trực tiếp trên trang.
- **Mức hỗ trợ ngoài hộ nghèo chưa được xác nhận**, và thủ tục nhận hỗ trợ đang là dự thảo.
- **Lớp mù trên ảnh là mô phỏng để minh họa**, không phải ảnh đo đạc thực tế.

## Đo lường hiệu quả

Các chỉ số dưới đây được báo cáo bằng số liệu thật, không đặt mục tiêu phần trăm trước.

| Chỉ số | Cách đo |
| --- | --- |
| Mức hiểu đúng quy định | Hỏi 3 câu kiểm tra trước và sau khi người dùng thử sản phẩm |
| Thời gian tìm ra câu trả lời | Quan sát trực tiếp khi người dùng thử |
| Số câu hỏi và nhóm chủ đề | Biểu mẫu thu câu hỏi, tổng hợp hằng tuần |
| Tỉ lệ câu hỏi trợ lý trả lời được | Đối chiếu câu hỏi với kho quy định |
| Mức độ quay lại và chia sẻ | Lượt dùng tính năng lưu ảnh, nhắc lịch |

## Lộ trình

| Giai đoạn | Nội dung | Trạng thái |
| --- | --- | --- |
| Web Beta | Tra cứu, bản đồ, chi phí, hỗ trợ, hỏi đáp, trợ lý, ảnh kết quả, nhắc lịch | Đã xong |
| Kiểm chứng | Phỏng vấn shipper, tiểu thương, cư dân Vành đai 1; thu câu hỏi thật | Đang làm |
| Trợ lý AI qua Zalo | Mô hình ngôn ngữ trả lời theo đúng Điều, Khoản của văn bản gốc, luôn trích dẫn | Tiếp theo |
| Thí điểm | Dùng ranh giới chính thức; gửi bảng tổng hợp câu hỏi định kỳ cho một phường | Sau đó |
| Mở rộng | Vành đai 2 (từ 2028), Vành đai 3 và các đô thị khác áp dụng vùng phát thải thấp | Dài hạn |

## Công nghệ và cách chạy

- HTML, CSS, JavaScript thuần trong một file `index.html`, không cần bước build.
- Bản đồ: [Leaflet](https://leafletjs.com/), nền bản đồ [OpenStreetMap](https://www.openstreetmap.org/copyright) và [CARTO](https://carto.com/attributions); tìm địa chỉ bằng [Nominatim](https://nominatim.org/).
- Triển khai miễn phí bằng GitHub Pages.

**Chạy trên máy:** mở `index.html` bằng trình duyệt. Cần kết nối mạng để tải ảnh, phông chữ và bản đồ. Tính năng "Vị trí của tôi" cần trang chạy qua https.

**Cấu trúc thư mục:**

```
chuyen-xanh/
├── index.html    Toàn bộ giao diện, dữ liệu quy định và logic
├── README.md
├── SOURCES.md    Nguồn dữ liệu, ngày cập nhật và việc cần bổ sung
├── LICENSE
└── .gitignore
```

## Cập nhật dữ liệu

Mọi dữ liệu có thể thay đổi đều nằm trong phần `<script>` của `index.html`:

| Muốn cập nhật | Sửa ở |
| --- | --- |
| Link biểu mẫu, ngày cập nhật | `CONFIG` |
| Quy định theo xe, khu vực, giai đoạn | `VEHICLES`, `AREAS`, hàm `evaluate` |
| Ranh giới khu vực trên bản đồ | `ZONES` |
| Câu hỏi thường gặp, kho của trợ lý | `FAQ`, `KB` |
| Thống kê câu hỏi nổi bật | `QUESTION_LOG`, `QUESTION_PERIOD` (chỉ điền số liệu thật) |
| Giá mẫu trong máy tính chi phí | thuộc tính `value` của các ô `gasPrice`, `elecPrice`, `evPrice`, `busPass` |

Mỗi lần cập nhật, ghi nguồn và ngày vào [SOURCES.md](SOURCES.md).

## Ghi công và giấy phép

- Ảnh: [Elliot Andrews](https://unsplash.com/photos/people-riding-motorcycle-on-road-near-building-during-daytime-6keOhd7idJo) và [Harry Tran](https://unsplash.com/photos/red-bridge-over-river-surrounded-by-trees-7oAFzGyemco) trên Unsplash, theo [Giấy phép Unsplash](https://unsplash.com/license).
- Dữ liệu bản đồ © OpenStreetMap contributors, nền bản đồ © CARTO.
- Mã nguồn phát hành theo [giấy phép MIT](LICENSE).

**Tác giả:** Hồ Lê Na · [GitHub](https://github.com/LenaHo-Jenia)
