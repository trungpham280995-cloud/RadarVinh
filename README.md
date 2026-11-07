# ĐỘI RADAR VINH 2026 — Website

Website tĩnh (HTML + CSS + JavaScript thuần), **không cần build, không cần Node.js, không cần máy chủ riêng**.
Có thể chạy độc lập và triển khai trực tiếp lên **GitHub + Vercel**.

## Cấu trúc thư mục

```
.
├── index.html                  Trang chính (khung HTML + các ô nội dung + liên kết Google Drive/Sheets)
├── vercel.json                 Cấu hình Vercel (tiêu đề bảo mật cơ bản, URL sạch)
├── .gitignore
├── README.md
├── css/
│   ├── main.css                Giao diện chính, bố cục, hiệu ứng, phông chữ Anton
│   ├── weather-widget.css      Khung/viên thuốc thời tiết (widget)
│   ├── weather-board.css       Bảng thời tiết neon, nút mũi tên thu gọn, hiệu ứng mở/thu
│   └── responsive.css          Giao diện dự phòng khi trình duyệt tắt JavaScript
├── js/
│   ├── main.js                 Hiệu ứng mở đầu, bố cục ô, chế độ nổi ảnh (nhấn giữ ~3 giây), điều hướng
│   ├── weather-widget.js       Widget thời tiết: lấy dữ liệu, vị trí, đồng bộ hiệu ứng
│   ├── weather-icons.js        Danh sách đường dẫn icon thời tiết (ngày/đêm)
│   ├── weather-board-src.js    Mã nguồn bảng thời tiết (nạp vào iframe)
│   └── weather-board.js        Điều khiển bảng/viên thuốc thời tiết trên máy tính và điện thoại
└── assets/
    ├── fonts/                  Phông Anton (latin, latin-ext, vietnamese) — dạng woff2
    └── images/
        ├── tiles/              22 ảnh nền của các ô (tile-01 … tile-22)
        ├── mobile-tile.jpg     Ảnh dùng riêng cho bản điện thoại
        └── weather/            19 icon thời tiết (day-1…day-10, night-1…night-9)
```

> **Quan trọng:** các thẻ `<script>` trong `index.html` phải giữ **đúng thứ tự** như hiện tại
> (`main.js` → `weather-widget.js` → `weather-icons.js` → `weather-board-src.js` → `weather-board.js`).

## Chạy thử trên máy

Cách đơn giản nhất: mở thư mục bằng **VS Code** + tiện ích **Live Server** → bấm *Go Live*.
Hoặc, nếu máy có Python:

```bash
python -m http.server 8000
# rồi mở http://localhost:8000
```

(Mở trực tiếp bằng cách bấm đúp `index.html` cũng chạy được, nhưng nên dùng máy chủ cục bộ để giống môi trường thật.)

## Đưa lên GitHub

**Cách 1 — Không cần cài gì (trên web):**
1. Vào https://github.com → **New repository** → đặt tên (ví dụ `radar-vinh-web`) → **Create repository**.
2. Bấm **uploading an existing file**, giải nén file ZIP rồi kéo thả **toàn bộ nội dung bên trong** (gồm `index.html`, các thư mục `css`, `js`, `assets` và các file còn lại) vào trang.
   - Lưu ý: `index.html` phải nằm **ở thư mục gốc** của repository, không nằm trong thư mục con.
3. Bấm **Commit changes**.

**Cách 2 — Dùng Git:**
```bash
git init
git add .
git commit -m "Website Doi Radar Vinh"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
git push -u origin main
```

## Triển khai bằng Vercel

1. Vào https://vercel.com → đăng nhập bằng tài khoản GitHub.
2. **Add New… → Project** → chọn repository vừa tạo → **Import**.
3. Cài đặt (để mặc định):
   - **Framework Preset:** `Other`
   - **Build Command:** để trống
   - **Output Directory:** để trống (hoặc `.`)
   - **Install Command:** để trống
4. Bấm **Deploy**. Vài chục giây sau sẽ có địa chỉ dạng `https://<ten-du-an>.vercel.app`.
5. Từ lần sau, mỗi lần bạn cập nhật file trên GitHub, Vercel sẽ tự triển khai lại.
   Muốn dùng tên miền riêng: **Project → Settings → Domains**.

## API, khóa bí mật và biến môi trường

- **Không có khóa API, không có biến môi trường, không có thông tin bí mật** trong mã nguồn. Không cần cấu hình thêm gì trên Vercel.
- Dịch vụ bên ngoài được dùng (đều miễn phí, không cần đăng ký):
  | Dịch vụ | Mục đích |
  |---|---|
  | Open-Meteo (`api.open-meteo.com`) | Dữ liệu thời tiết Vinh, Nghệ An (không cần API key) |
  | Google Fonts (`fonts.googleapis.com`) | Phông Inter / Be Vietnam Pro trong bảng thời tiết |
  | Google Drive / Google Sheets | Các liên kết tài liệu trên các ô (mở bằng đường dẫn đã có sẵn trong `index.html`) |
- Cần có Internet để hiển thị dữ liệu thời tiết trực tuyến; nếu mất mạng, bảng tự thử lại sau 20 giây.

## Tùy chỉnh thường gặp

- **Đổi địa điểm thời tiết:** sửa `place`, `lat`, `lon` trong `js/weather-widget.js` (dòng `var CFG={...}`)
  và `location:{name,country,tz,lat,lon}` trong `js/weather-board-src.js`.
- **Đổi liên kết Google Drive/Sheets của các ô:** sửa trong `index.html` (tìm `drive.google.com` / `docs.google.com`).
- **Thay ảnh nền các ô:** thay file trong `assets/images/tiles/` bằng ảnh mới **cùng tên** (giữ nguyên định dạng JPG).
  Nếu trình duyệt vẫn hiện ảnh cũ, bấm Ctrl+F5 để tải lại.

## Kiểm tra sau khi triển khai

Mở địa chỉ Vercel trên máy tính và điện thoại, kiểm tra: hiệu ứng mở đầu chạy hết, các ô hiện đủ ảnh,
bảng thời tiết hiện đúng số liệu, nút mũi tên thu gọn/mở bảng hoạt động, nhấn giữ ~3 giây trên máy tính
kích hoạt chế độ nổi ảnh (bảng thời tiết lùi ra sau cùng lớp chữ).
