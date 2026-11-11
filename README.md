# Chuyển Xanh

**Tra cứu quy định vùng phát thải thấp Hà Nội cho đúng chiếc xe, đúng nơi, đúng giờ của bạn, và tìm cách chuyển sang phương tiện xanh với chi phí thấp nhất.**

[Dùng thử](https://chuyen-xanh.vercel.app) · [Nguồn dữ liệu](SOURCES.md) · [Triển khai](#triển-khai) · [Giấy phép MIT](LICENSE)

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
10. [Kiến trúc](#kiến-trúc)
11. [Chạy trên máy](#chạy-trên-máy)
12. [Triển khai](#triển-khai)
13. [Cập nhật dữ liệu](#cập-nhật-dữ-liệu)
14. [Ghi công và giấy phép](#ghi-công-và-giấy-phép)

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
3. **Hỏi đáp:** trợ lý AI chỉ trả lời dựa trên kho văn bản quy định, luôn trích nguồn, nói rõ khi chưa có căn cứ.
4. **Phản hồi ngược:** mọi câu hỏi được lưu ẩn danh và tự gắn chủ đề. Mục "Câu hỏi nổi bật" tự cập nhật, và danh sách câu trợ lý chưa trả lời được cho thấy quy định nào đang gây nhầm lẫn hoặc còn thiếu.

## Tính năng

| Tính năng | Mô tả | Trạng thái |
| --- | --- | --- |
| Tra nhanh 30 giây | Kết quả theo loại xe, khu vực, ngày giờ; kèm căn cứ và lộ trình 2026–2028 | Hoạt động |
| Bản đồ chọn điểm đến | Chạm bản đồ, tìm tên phố hoặc dùng vị trí hiện tại; tự xác định Khu vực 1, 2, 3 hay Vành đai 1 | Hoạt động, ranh giới gần đúng |
| Mô phỏng bụi mịn | Ảnh đường phố phủ lớp mù theo mức PM2.5: chuẩn WHO, cả nước, Hà Nội | Hoạt động, chỉ để minh họa |
| Chi phí chuyển đổi | So sánh xe xăng, xe điện, xe buýt và metro; tính thuê pin, hỗ trợ, bán xe cũ, thời gian hòa vốn | Hoạt động |
| Hỗ trợ đổi xe | Điều kiện theo Nghị quyết 68/2026/NQ-HĐND và danh sách giấy tờ cần giữ | Hoạt động |
| Hỏi đáp | Câu hỏi thường gặp có tìm kiếm, mỗi câu kèm căn cứ | Hoạt động |
| Trợ lý AI | Gemini trả lời chỉ từ các đoạn văn bản được tìm thấy trong kho (RAG), trích nguồn, từ chối khi thiếu căn cứ; tự chuyển sang tìm từ khóa khi không có mạng hoặc chưa có khóa API | Hoạt động |
| Lưu ảnh kết quả | Ảnh khổ 4:5 để chia sẻ Facebook, Zalo | Hoạt động |
| Nhắc trước mốc mới | File lịch .ics nhắc trước 7 ngày các mốc 1/1/2027 và 1/1/2028 | Hoạt động |
| Song ngữ Việt – Anh | Đổi ngôn ngữ toàn trang, kể cả kết quả, ảnh chia sẻ, lịch nhắc và trợ lý; nhớ lựa chọn của người dùng | Hoạt động |
| Link chia sẻ kết quả | Mỗi lần tra tạo một link riêng; người nhận mở link thấy đúng xe, khu vực, giờ và kết quả đó | Hoạt động |
| Cài lên điện thoại | Cài như ứng dụng từ trình duyệt; tra cứu, tính chi phí và hỏi đáp vẫn dùng được khi mất mạng | Hoạt động (cần https) |
| Gửi câu hỏi | Người dân gửi câu hỏi chưa có trong mục Hỏi đáp; lưu ẩn danh, tự xóa số điện thoại và email | Hoạt động |
| Câu hỏi nổi bật | Tự thống kê chủ đề được hỏi nhiều nhất trong 14 ngày, chỉ hiện khi đủ số câu tối thiểu | Hoạt động, đang thu thập dữ liệu |

## Nguyên tắc thiết kế

1. **Mọi thông tin đều có nguồn.** Mỗi kết quả và câu trả lời ghi rõ căn cứ, kèm link.
2. **Không chắc thì nói không chắc.** Thủ tục còn là dự thảo, ranh giới chưa có dữ liệu chính thức, câu hỏi ngoài phạm vi: trang đều nói rõ thay vì đoán.
3. **Không thu thập dữ liệu cá nhân.** Không tài khoản. Chỉ lưu nội dung câu hỏi, không lưu tên, IP hay vị trí; số điện thoại và email trong câu hỏi bị xóa trước khi lưu. Vị trí hiện tại chỉ dùng trên máy người dùng để xác định khu vực.
4. **Viết cho người bận rộn.** Ngôn ngữ đời thường, thiết kế cho điện thoại trước, câu trả lời ngắn và đi thẳng vào trường hợp cụ thể.
5. **Không thay thế chính quyền.** Văn bản chính thức của thành phố luôn là căn cứ cuối cùng.

## Giới hạn hiện tại

- **Ranh giới khu vực trên bản đồ là gần đúng.** Ranh giới được vẽ theo danh sách phố bao quanh mà báo chí công bố. Ở sát ranh giới, người dùng cần đối chiếu bản đồ chính thức.
- **Trợ lý AI có thể diễn đạt sai.** Câu trả lời bị giới hạn trong kho văn bản và luôn kèm nguồn để người dùng tự kiểm tra, nhưng vẫn cần đối chiếu văn bản gốc trước khi quyết định.
- **Kho văn bản còn nhỏ** (17 đoạn, tóm tắt từ báo chí). Bước tiếp theo là đưa văn bản gốc theo Điều, Khoản vào kho.
- **Giới hạn tần suất đang lưu trong bộ nhớ máy chủ**, đủ cho quy mô thử nghiệm; khi có nhiều người dùng cần chuyển sang kho dùng chung như Redis.
- **Giá xăng, điện, xe điện và vé xe buýt là số mẫu.** Người dùng có thể sửa trực tiếp trên trang.
- **Mức hỗ trợ ngoài hộ nghèo chưa được xác nhận**, và thủ tục nhận hỗ trợ đang là dự thảo.
- **Lớp mù trên ảnh là mô phỏng để minh họa**, không phải ảnh đo đạc thực tế.

## Đo lường hiệu quả

Các chỉ số dưới đây được báo cáo bằng số liệu thật, không đặt mục tiêu phần trăm trước.

| Chỉ số | Cách đo |
| --- | --- |
| Mức hiểu đúng quy định | Hỏi 3 câu kiểm tra trước và sau khi người dùng thử sản phẩm |
| Thời gian tìm ra câu trả lời | Quan sát trực tiếp khi người dùng thử |
| Số câu hỏi và nhóm chủ đề | Bảng `questions` trên Supabase, tự thống kê |
| Tỉ lệ câu hỏi trợ lý trả lời được | Cột `answered` trong bảng `questions`; câu chưa trả lời được xem ở `unanswered_questions` |
| Mức độ quay lại và chia sẻ | Lượt dùng tính năng lưu ảnh, nhắc lịch |

## Lộ trình

| Giai đoạn | Nội dung | Trạng thái |
| --- | --- | --- |
| Web Beta | Tra cứu, bản đồ, chi phí, hỗ trợ, hỏi đáp, ảnh kết quả, nhắc lịch, song ngữ, cài lên điện thoại | Đã xong |
| Trợ lý AI và dữ liệu hai chiều | Next.js, trợ lý Gemini có trích nguồn, lưu và thống kê câu hỏi trên Supabase | Đã xong |
| Kiểm chứng | Phỏng vấn shipper, tiểu thương, cư dân Vành đai 1; thu câu hỏi thật | Đang làm |
| Văn bản gốc và Zalo | Đưa văn bản gốc theo Điều, Khoản vào kho; mở trợ lý qua Zalo OA | Tiếp theo |
| Thí điểm | Dùng ranh giới chính thức; gửi bảng tổng hợp câu hỏi định kỳ cho một phường | Sau đó |
| Mở rộng | Vành đai 2 (từ 2028), Vành đai 3 và các đô thị khác áp dụng vùng phát thải thấp | Dài hạn |

## Kiến trúc

```
Trình duyệt (Next.js, React)                  Máy chủ Next.js (Vercel)                Dịch vụ ngoài
──────────────────────────                    ─────────────────────────               ─────────────
Tra cứu, bản đồ, chi phí  ── chạy trên máy, đọc data/*.json, dùng được khi mất mạng
Trợ lý           ── POST /api/ask ──────────► 1. Tìm đoạn liên quan trong kho  
                                              2. Gửi đúng các đoạn đó ───────────────► Gemini
                                              3. Chỉ giữ nguồn có thật trong kho ◄────
                                              4. Lưu câu hỏi ẩn danh ─────────────────► Supabase
Gửi câu hỏi      ── POST /api/questions ────► Xóa SĐT, email, gắn chủ đề, lưu ─────► Supabase
Câu hỏi nổi bật  ── GET /api/top-questions ─► Đếm theo chủ đề 14 ngày, CDN giữ 10 phút ◄ Supabase
```

| Lớp | Công nghệ |
| --- | --- |
| Giao diện | [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript, CSS thuần |
| Bản đồ | [Leaflet](https://leafletjs.com/), nền [OpenStreetMap](https://www.openstreetmap.org/copyright) và [CARTO](https://carto.com/attributions), tìm địa chỉ bằng [Nominatim](https://nominatim.org/) |
| Trợ lý AI | Google Gemini API, đầu ra JSON theo lược đồ, tìm đoạn văn bản bằng TF-IDF trên tiếng Việt bỏ dấu và tiếng Anh |
| Cơ sở dữ liệu | [Supabase](https://supabase.com/) (PostgreSQL), bật RLS, chỉ máy chủ được đọc ghi |
| Ứng dụng di động | PWA: cài lên màn hình chính, dùng khi mất mạng |
| Kiểm thử | [Vitest](https://vitest.dev/): 400 tình huống đối chiếu với bản đầu tiên, tìm kiếm, bảo vệ dữ liệu, lọc nguồn AI |

**Chạy được ở mọi mức cấu hình.** Thiếu khóa Gemini, trợ lý tự tìm theo từ khóa. Thiếu Supabase, ô gửi câu hỏi tự ẩn và mục câu hỏi nổi bật hiện trạng thái chờ. Tra cứu, bản đồ và tính chi phí không cần máy chủ.

## Chạy trên máy

Cần Node.js 20 trở lên.

```bash
npm install
cp .env.example .env.local   # điền khóa nếu có, để trống vẫn chạy
npm run dev                  # mở http://localhost:3000
npm test                     # chạy kiểm thử
```

**Cấu trúc thư mục:**

```
chuyen-xanh/
├── data/                   Dữ liệu, sửa ở đây là trang tự cập nhật
│   ├── rules.json          Xe, khu vực, giai đoạn, bảng kết quả theo xe và giai đoạn
│   ├── zones.json          Ranh giới khu vực trên bản đồ (gần đúng)
│   ├── knowledge.json      Kho văn bản cho Hỏi đáp và trợ lý AI
│   ├── documents.json      Danh sách giấy tờ nên giữ
│   └── sources.json        Nguồn và ngày
├── messages/               Chữ trên giao diện: vi.json, en.json
├── src/
│   ├── app/                Trang và API (ask, questions, top-questions)
│   ├── components/         Các phần của trang
│   └── lib/                Logic quy định, tìm kiếm, chi phí, chia sẻ, máy chủ
├── supabase/schema.sql     Tạo bảng câu hỏi
├── public/                 Biểu tượng, manifest, service worker
├── tests/                  Kiểm thử
└── SOURCES.md              Nguồn dữ liệu và việc cần bổ sung
```

## Triển khai

Toàn bộ dùng gói miễn phí.

1. **Supabase:** tạo project tại [supabase.com](https://supabase.com/), mở SQL Editor, chạy toàn bộ `supabase/schema.sql`. Vào Project Settings → API Keys, lấy Project URL và secret key.
2. **Gemini:** tạo khóa API tại [Google AI Studio](https://aistudio.google.com/apikey).
3. **Vercel:** đăng nhập [vercel.com](https://vercel.com/) bằng GitHub, Add New → Project → chọn repo `chuyen-xanh`. Ở Environment Variables, nhập `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, rồi Deploy.
4. Mỗi lần đẩy code lên nhánh `main`, Vercel tự triển khai lại.

Khóa bí mật chỉ nằm trên Vercel và trong `.env.local` trên máy, **không bao giờ đưa lên GitHub**.

## Cập nhật dữ liệu

| Muốn cập nhật | Sửa ở |
| --- | --- |
| Ngày cập nhật quy định | `updated` trong `data/rules.json` |
| Quy định theo xe, khu vực, giai đoạn | `vehicles`, `areas`, `matrix`, `outcomes` trong `data/rules.json` |
| Ranh giới khu vực trên bản đồ | `data/zones.json` |
| Câu hỏi thường gặp, kho của trợ lý | `data/knowledge.json` (`faq: true` thì hiện ở mục Hỏi đáp) |
| Chữ trên giao diện | `messages/vi.json`, `messages/en.json` |
| Giá mẫu trong máy tính chi phí | `DEFAULT_COST` trong `src/lib/cost.ts` |
| Số câu tối thiểu để hiện câu hỏi nổi bật | biến môi trường `TOP_QUESTIONS_MIN` (mặc định 10) |

Mỗi lần cập nhật, ghi nguồn và ngày vào [SOURCES.md](SOURCES.md), chạy `npm test`, và đổi `VERSION` trong `public/sw.js` để người đã cài ứng dụng nhận bản mới. Bản web tĩnh đầu tiên (một file HTML) vẫn xem được ở [commit c6f9272](https://github.com/LenaHo-Jenia/chuyen-xanh/tree/c6f9272).

## Ghi công và giấy phép

- Ảnh: [Elliot Andrews](https://unsplash.com/photos/people-riding-motorcycle-on-road-near-building-during-daytime-6keOhd7idJo) và [Harry Tran](https://unsplash.com/photos/red-bridge-over-river-surrounded-by-trees-7oAFzGyemco) trên Unsplash, theo [Giấy phép Unsplash](https://unsplash.com/license).
- Dữ liệu bản đồ © OpenStreetMap contributors, nền bản đồ © CARTO.
- Mã nguồn phát hành theo [giấy phép MIT](LICENSE).

**Tác giả:** Hồ Lê Na · [GitHub](https://github.com/LenaHo-Jenia)
