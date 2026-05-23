# VEO3 Production Deploy Checklist

Danh sách kiểm tra hệ thống trước khi launch chính thức cho `veo3ai.pro.vn`.

## 🌐 Hạ tầng & Domain
- [x] ✅ **Domain hoạt động**: `veo3ai.pro.vn` đã trỏ đúng.
- [x] ✅ **Cloudflare hoạt động**: Proxy DNS và SSL (HTTPS) đã được bật.
- [x] ✅ **Railway deploy thành công**: Build pass, server Node.js chạy bình thường trên production.

## 🔗 Luồng người dùng & Web
- [x] ✅ **`/thanh-toan` hoạt động**: Form đặt hàng hiển thị đúng, gọi API tạo đơn thành công.
- [x] ✅ **`/success` hoạt động**: Đã fix lỗi `Cannot GET /success`, route đã hiển thị giao diện thành công.

## 💳 Thanh toán & Database
- [x] ✅ **SePay hoạt động**: Check payment API bắt được webhook/Giao dịch và tự động cập nhật trạng thái đơn hàng.
- [x] ✅ **CRM lưu dữ liệu**: Thông tin khách hàng (Tên, SĐT, Email, Zalo) được lưu chuẩn vào DB (SQLite `customers` & `orders`).

## 📧 Email Marketing (Resend)
- [x] ✅ **Resend verified**: Đã xác thực thành công hoặc sử dụng sender hợp lệ qua Resend.
- [x] ✅ **FROM_EMAIL hoạt động**: Email gửi đi hiển thị đúng tên người gửi.
- [x] ✅ **Email xác nhận đơn hàng hoạt động**: Gửi ngay khi khách tạo đơn hàng.
- [x] ✅ **Email automation hoạt động**: Chuỗi email Nurturing 3 ngày chạy ổn định.
