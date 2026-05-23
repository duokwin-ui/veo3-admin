# ROADMAP 90 NGÀY + ASKS
## Tự đánh giá thực trạng và lộ trình tiếp theo

---

# PHẦN 1: ROADMAP 90 NGÀY

## Thực trạng hiện tại

Dựa trên 12 agent outputs đã tạo:

- **Sản phẩm:** AI Starter Kit — 497k, digital product tự phục vụ
- **Funnel:** HVCO Model — checklist miễn phí → email nurture → sales page
- **Technical:** Đã có landing page, checkout, thanh toán SePay, email automation
- **Marketing:** Ad copy đã viết, chưa chạy thử
- **Team:** Một mình

---

## THÁNG 1 — VALIDATION

**Mục tiêu:** Thật sự bán được sản phẩm cho người thật. Có tiền vào.

### Milestone 1.1: Deploy và test landing page

**Mục tiêu:** Landing page sống trên internet, có người tải checklist

**Hành động:**
1. Deploy `08-landing.html` lên hosting (Netlify/Vercel — miễn phí)
2. Tạo file PDF checklist từ nội dung landing
3. Setup redirect khi click "Tải Checklist" → link Google Drive/Mediafire
4. Chia sẻ landing page lên Facebook cá nhân, 1-2 group nhỏ
5. Theo dõi: có bao nhiêu người vào page, bao nhiêu người tải

**Dùng asset:** `08-landing.html`

**KPI:**
- 50-100 lượt xem landing page (tuần đầu)
- 10-20 lượt tải checklist

---

### Milestone 1.2: Bán sản phẩm đầu tiên

**Mục tiêu:** Có 1 người mua thật. Không cần nhiều. Chỉ cần 1.

**Hành động:**
1. Tối ưu thank you page (nếu chưa có, viết thêm)
2. Gửi email nurture cho người đã tải checklist
3. Thử bán trực tiếp cho bạn bè/family — không cần funnel
4. Nếu chưa bán được → hỏi phản hồi từ người tải checklist
5. Điều chỉnh copy dựa trên phản hồi

**Dùng asset:** `10-email-sequence.md`, `08-ads-copy.md`

**KPI:**
- 1-3 đơn hàng trong tháng đầu
- Feedback từ người mua đầu tiên

---

### Milestone 1.3: Setup email automation cơ bản

**Mục tiêu:** Email tự gửi khi có người tải checklist

**Hành động:**
1. Setup Resend (đã có từ Day 19) — kết nối với landing page
2. Tạo sequence 4 emails từ `10-email-sequence.md`
3. Setup automation: tải checklist → gửi Email 1 tự động
4. Test: tự mình đi qua funnel để verify flow hoạt động

**Dùng asset:** `10-email-sequence.md`, `11-follow-up.md`

**KPI:**
- Email automation chạy không lỗi
- 100% người tải checklist nhận được email

---

## THÁNG 2 — LEARN & ITERATE

**Mục tiêu:** Hiểu audience thật. Tối ưu based on data. Bắt đầu có traffic nhỏ nhưng steady.

### Milestone 2.1: Chạy thử ads nhỏ

**Mục tiêu:** Có traffic paid vào landing page. Hiểu ad copy nào hoạt động.

**Hành động:**
1. Chọn 1 ad angle từ `08-ads-copy.md` (gợi ý: Ad 3 — Curiosity + Specific Promise)
2. Chạy Facebook/TikTok ads — budget tối thiểu: 100-200k/ngày
3. Test 2-3 variations của headline và image
4. Theo dõi: CTR, tỷ lệ tải, tỷ lệ mua

**Dùng asset:** `08-ads-copy.md`, `08-landing.html`

**KPI:**
- CTR > 2%
- Cost per click < 5k
- Bắt đầu có người mua từ ads

---

### Milestone 2.2: Thu thập feedback và testimonials

**Mục tiêu:** Có 3-5 testimonials thật từ người mua

**Hành động:**
1. Liên hệ người mua sau 3-7 ngày — hỏi kết quả thật
2. Nếu họ thích → xin testimonial ngắn
3. Cập nhật landing page + emails với testimonials thật
4. Bắt đầu xây case study từ feedback

**Dùng asset:** `08-landing.html`, `10-email-sequence.md`

**KPI:**
- 3-5 testimonials có thể dùng được
- Ít nhất 1 case study "trước/sau" cụ thể

---

### Milestone 2.3: Tối ưu funnel dựa trên data

**Mục tiêu:** Tăng tỷ lệ chuyển đổi sau khi có data thật

**Hành động:**
1. Phân tích: ad nào click nhiều, email nào mở nhiều, checkpoint nào drop off
2. A/B test thêm: thay đổi 1 thứ, đo kết quả
3. Tối ưu copy dựa trên phản hồi thật
4. Nếu tỷ lệ tải → mua < 3% → xem lại landing page

**Dùng asset:** Tất cả files trong thư mục

**KPI:**
- Tỷ lệ tải → mua > 3%
- Email open rate > 30%

---

## THÁNG 3 — SCALE NHẸ

**Mục tiêu:** Tăng doanh thu. Bắt đầu có upsell. Không cần team.

### Milestone 3.1: Tăng budget ads nếu profitable

**Mục tiêu:** Nếu ads có ROI dương → tăng budget. Nếu không → dừng, tập trung organic.

**Hành động:**
1. Tính ROI thật: revenue từ ads / cost ads
2. Nếu ROI > 1.5 → tăng budget lên 300-500k/ngày
3. Nếu ROI < 1 → dừng ads, tập trung content organic
4. Scale ad nào chạy tốt nhất

**Dùng asset:** `08-ads-copy.md`

**KPI:**
- Revenue từ ads >= cost ads
- 5-10 đơn/tuần nếu profitable

---

### Milestone 3.2: Setup upsell nhẹ

**Mục tiêu:** Tăng AOV (giá trị đơn hàng trung bình) bằng upsell

**Hành động:**
1. Tạo 1 upsell đơn giản: "Thêm 7 quy trình khác — giá [X]"
2. Thêm vào thank you page hoặc email follow-up
3. Không bắt buộc — chỉ gợi ý nhẹ
4. Đo xem có bao nhiêu người mua upsell

**Dùng asset:** `05-offer.md`, `04-money-model.md`

**KPI:**
- 10-20% người mua mua thêm upsell
- AOV tăng 20-30%

---

### Milestone 3.3: Bắt đầu content organic

**Mục tiêu:** Giảm phụ thuộc vào ads. Xây audience tự nhiên.

**Hành động:**
1. Chọn 1 nền tảng: TikTok hoặc Facebook Group
2. Chia sẻ content có giá trị (tips nhỏ về AI workflow)
3. Nhúng link landing page vào content
4. Xây dần audience — mục tiêu 100-200 follower engaged

**Dùng asset:** `02-brand-voice.md`, `03-hero-mechanism.md`

**KPI:**
- 1-2 content posts/tuần
- Tăng traffic organic lên 20-30% tổng traffic

---

# PHẦN 2: ASKS — TÔI CẦN GÌ ĐỂ ĐI NHANH HƠN

## 1. ĐIỂM YẾU LỚN NHẤT

**Tôi đang thiếu: Traffic và Proof**

Cụ thể:

**Traffic:**
- Hiện tại chưa có ai vào landing page ngoài tôi và có thể vài người bạn
- Ad copy đã viết nhưng chưa test với người thật
- Không biết hook nào sẽ convert

**Proof:**
- Chưa có testimonials từ người mua thật
- Chưa có case study thật
- Không biết sản phẩm có giải quyết được vấn đề thật không

**Kỹ thuật:**
- Đã có landing page + checkout + SePay → cái này OK
- Nhưng chưa setup email automation hoàn chỉnh
- Chưa deploy landing page lên internet

**Tóm:** Tôi đang ở giai đoạn "có sản phẩm nhưng không có ai biết"

---

## 2. NẾU CÓ THỂ NHỜ HỖ TRỢ — TÔI MUỐN ĐƯỢC HỖ TRỢ VỀ:

### □ Coaching 1-1 về chiến lược kinh doanh

**Mong muốn:** 
Người đã đi qua giai đoạn này rồi — cho tôi biết tôi đang làm đúng hay sai. Review funnel, cho feedback thật.

**Cụ thể:**
- Landing page này có bán được không?
- Offer 497k có hợp lý không?
- Funnel này có vấn đề gì mà tôi không thấy?

### □ Setup ads/funnel giúp tôi

**Mong muốn:**
Tôi đã có ad copy trong `08-ads-copy.md` nhưng không biết setup ads Facebook/TikTok sao cho đúng. Cần ai đó:
- Hướngẫn setup campaign đầu tiên
- Chỉ cho tôi cách target đúng audience
- Giúp tôi tránh những sai lầm beginner hay mắc

### □ Khoá học hoặc tài liệu về:

**Cụ thể:**
- Cách chạy ads nhỏ để test (budget 100-300k)
- Cách thu thập testimonials từ người mua
- Cách setup email automation với Resend (đã có tài khoản nhưng chưa biết cấu hình)
- Cách viết content TikTok/Facebook mà không phải quay video

### □ Khác:
- Cộng đồng để hỏi khi gặp vấn đề cụ thể
- Template/format để theo dõi metrics đơn giản

---

## 3. TRONG 90 NGÀY TỚI — 3 VẤN ĐỀ TÔI SỢ KẺT NHẤT

### Vấn đề 1: Bỏ giữa chừng vì không thấy kết quả nhanh

**Sợ cụ thể:**
Tôi biết mình hay bỏ. Sau 2-3 tuần không bán được ai → tôi sẽ nản → chuyển qua ý tưởng khác → lặp lại vòng lặp.

**Điều tôi cần:**
- Cần thấy 1 đơn hàng đầu tiên càng sớm càng tốt — để biết "có thể bán được"
- Cần ai đó nhắc tôi: "tháng đầu không kỳ vọng lớn, chỉ cần validate"

### Vấn đề 2: Tự kỷ trong việc tạo content

**Sợ cụ thể:**
Tôi không phải người content. Tôi không biết quay video, không biết viết bài hay. Sợ content tôi đăng không ai xem → nản → bỏ.

**Điều tôi cần:**
- Format content đơn giản, không cần quay mặt (VD: chỉ cần viết caption + hình chụp màn hình)
- Benchmark: "content nào tôi có thể bắt đầu với 30 phút/ngày"

### Vấn đề 3: Không biết ai là audience của mình

**Sợ cụ thể:**
Tôi đã viết avatar "Minh" trong `01-avatar.md` — nhưng đó là giả định. Không biết Minh thật có tồn tại không, có ở Facebook group nào, có dùng TikTok không.

**Điều tôi cần:**
- Cách để tìm audience thật (không phải suy đoán)
- Cách validate avatar trước khi viết thêm copy

---

## TÓM TẮT

### 3 điều tôi cần nhất:

1. **AI người đầu tiên mua hàng** — để biết sản phẩm bán được
2. **Feedback thật** — để biết tôi đang làm đúng hay sai
3. **Một người đã đi qua giai đoạn này** — để hỏi khi bí

### 3 điều tôi KHÔNG cần (nhưng sợ):

1. Không cần biết everything về AI — chỉ cần biết đủ để bán
2. Không cần team — chỉ cần mình tôi + 1 advisor
3. Không cần ads budget lớn — chỉ cần đủ để test và validate

---

*Mình viết cái này để nhìn thật vào bản thân. Không phải để than phiền. Mà là để biết mình đang ở đâu, cần gì, và sợ gì — trước khi tiếp tục.*
