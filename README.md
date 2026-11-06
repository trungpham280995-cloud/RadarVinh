# ĐỘI RADAR VINH 2026

## Nội dung
- `index.html`: mã nguồn website hiện tại, được giữ nguyên từ file người dùng cung cấp.

## Chạy thử
Đây là website HTML tĩnh. Có thể mở `index.html` trực tiếp bằng trình duyệt để kiểm tra cơ bản.

## Đưa lên GitHub
1. Tạo một repository mới trên GitHub.
2. Tải `index.html` lên thư mục gốc của repository.
3. Commit/push mã nguồn.

## Triển khai bằng Vercel
1. Đăng nhập Vercel và chọn Add New > Project.
2. Import repository GitHub vừa tạo.
3. Với website HTML tĩnh này, không cần framework build.
4. Để Build Command trống; Output Directory dùng `.` nếu Vercel yêu cầu cấu hình.
5. Chọn Deploy.

## Lưu ý
- Không đổi tên `index.html` nếu muốn Vercel tự nhận làm trang mặc định.
- Website có sử dụng Google Fonts và các liên kết Google Drive/Google Sheets bên ngoài; các dịch vụ này cần tiếp tục hoạt động và có quyền truy cập phù hợp.
- Mã nguồn được giữ nguyên; việc đóng gói không đồng nghĩa đã kiểm thử toàn bộ chức năng trên môi trường production.
- Nếu website cần dùng tên miền riêng, thêm tên miền trong phần Project Settings > Domains của Vercel sau khi triển khai.
