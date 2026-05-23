# Brain Score - Day 9

## Hôm nay đã làm
- Tạo chatbot bán hàng cho website VEO3
- Tạo thư mục /data
- Tạo FAQ và objection handling
- Copy brain.db vào project
- Tạo sales_script.md
- Gắn chatbot vào website
- Test chatbot với khách hàng giả lập
- Đăng bài thông báo chatbot

## Kết quả
- Chatbot hoạt động
- Có thể trả lời câu hỏi cơ bản
- Website chạy ổn

## Điểm tự đánh giá
8/10
# Day 10 Score Update

## Hoàn thành:

* Build landing page production
* Deploy website lên Railway
* Kết nối SePay nhận thanh toán tự động
* Build CRM quản lý khách hàng
* Build admin panel quản lý sản phẩm / đơn hàng
* Flow checkout tự động:
  pending → success
* QR thanh toán hoạt động production
* API check payment hoạt động production
* Auto redirect success page sau thanh toán

## Đã test:

* Tạo đơn hàng thật
* Quét QR thật
* Chuyển khoản test 2.000đ
* SePay nhận giao dịch
* Đơn hàng tự chuyển success
* Checkout hiển thị thanh toán thành công

## Bài học:

* Hiểu cách deploy production bằng Railway
* Hiểu cách dùng environment variables
* Hiểu flow payment polling
* Hiểu cách debug production error
* Hiểu sự khác nhau giữa localhost và production

## Lỗi đã gặp:

* QR payment code không match
* Fallback amount match gây nhận nhầm giao dịch cũ
* Railway chưa apply SEPAY_API_KEY
* sqlite node_modules deploy lỗi

## Đã fix:

* Normalize payment code
* Chỉ match transaction theo content
* Remove node_modules khỏi git
* Apply lại Railway variables
* Redeploy production thành công

## Hiện tại hệ thống đã chạy:

Khách nhập form → tạo order pending → QR thanh toán → SePay nhận tiền → order success → redirect trang cảm ơn.

Day 11
Hoàn thành
Kết nối Resend vào website
Test gửi email thành công
Nhận đủ 3 email automation
Test email xác nhận đơn hàng
CRM đã lưu email khách hàng
SePay vẫn hoạt động bình thường
Khó khăn
Lỗi port 3000
Lỗi Resend verify domain
Chưa hiểu flow email automation lúc đầu
Học được
Cách hoạt động của email automation
CRM + Resend + SePay kết nối với nhau như thế nào
Cách debug server và API
Tự đánh giá

8/10