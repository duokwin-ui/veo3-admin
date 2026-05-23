# ROADMAP 90 NGÀY + ASKS
## Tự đánh giá thực trạng và lộ trình tiếp theo

---

# PHẦN 1: ROADMAP 90 NGÀY

## Thực trạng hiện tại

Dựa trên 12 agent outputs đã tạo:

- **Sản phẩm:** AI Starter Kit — 149k, digital product tự phục vụ
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

**Tôi đang thiếu: Traffic, Validation, Kỹ thuật, Tư duy**

Cụ thể:

**Traffic:**
- Không biết quay, sản xuất video, không biết viết hay → content không ai xem
- Nên chưa biết cách kéo traffic ổn định vào landing page

**Validation:**
- Chưa có khách thật mua nên chưa có feedback/testimonial

**Kỹ thuật:**
- Đã có landing + checkout + SePay — cái này OK
- Tuy nhiên làm được theo AI hướng dẫn nhưng chưa hiểu rõ lắm về các công đoạn trong khi làm
- Ví dụ: Antigravity, Cursor, VS Code, GitHub / Railway / Netlify / GCloud / VPS…

**Tư duy:**
- Chưa rõ nên build sản phẩm gì phù hợp để bán lâu dài

---

## 2. HỖ TRỢ MONG MUỐN

### □ Review funnel + landing theo góc nhìn thực chiến

**Mong muốn:**
Vì vẫn thấy nhiều cái cần tối ưu — cần người nhìn ra vấn đề mình không thấy.

### □ Hướng dẫn chọn hướng AI workflow dễ kiếm tiền cho beginner

**Mong muốn:**
Chưa rõ nên tập trung vào hướng nào — cần ai đó chỉ hướng cụ thể.

### □ Giải thích flow GitHub → Railway → deploy dễ hiểu hơn

**Mong muốn:**
Biết làm theo hướng dẫn nhưng không hiểu tại sao lại làm vậy — cần hiểu bản chất.

### □ Hướng dẫn làm content đơn giản, phù hợp cho người không giỏi quay video

**Mong muốn:**
Cần format content cụ thể — không cần quay mặt, có thể bắt đầu với 30 phút/ngày.

### □ Cách làm — xem lại kế hoạch, góp ý thật

**Mong muốn:**
Coaching 1-1: nhìn lại plan, chỉ ra sai sót, gợi hướng đi.

---

## 3. TRONG 90 NGÀY TỚI — 3 VẤN ĐỀ TÔI SỢ KẺT NHẤT

### Vấn đề 1: Làm được theo AI nhưng không hiểu nền tảng

**Sợ cụ thể:**
Làm theo hướng dẫn thì OK, nhưng khi lỗi xảy ra — không biết sửa. Không hiểu code, nền tảng lập trình nên bó tay.

**Điều tôi cần:**
- Hiểu rõ hơn về nền tảng (không cần expert, chỉ cần đủ để tự debug được)
- Hoặc có người hỗ trợ kỹ thuật khi cần

### Vấn đề 2: Học quá nhiều tool AI nhưng không tạo ra thu nhập thật

**Sợ cụ thể:**
Cứ thấy tool mới là học, thấy khóa hay là mua — nhưng cuối cùng không có sản phẩm bán được. Mua nhiều nhưng không kiếm được gì.

**Điều tôi cần:**
- Tập trung vào 1-2 tool đủ dùng, không lan man
- Có người nhắc: "Dừng học, bắt đầu bán"

### Vấn đề 3: Không biết tập trung build sản phẩm/service nào trước

**Sợ cụ thể:**
Không hiểu lập trình, không biết code, không biết nên build cái gì trước. Có nhiều ý tưởng nhưng không biết cái nào sẽ kiếm được tiền.

**Điều tôi cần:**
- Hướng dẫn chọn 1 sản phẩm cụ thể để bắt đầu
- Không phải ý tưởng hoàn hảo — chỉ cần bắt đầu được

---

## TÓM TẮT

### 3 điều tôi cần nhất:

1. **Hướng đi rõ ràng** — chọn 1 hướng AI workflow cụ thể để tập trung
2. **Review thực chiến** — xem lại funnel + landing, chỉ ra điểm yếu thật
3. **Hỗ trợ kỹ thuật** — hiểu rõ hơn về deploy, GitHub, Railway

### 3 điều tôi KHÔNG cần (nhưng sợ):

1. Không cần học thêm nhiều tool AI — chỉ cần biết đủ 1 tool để bán
2. Không cần hiểu hết code — chỉ cần đủ để tự sửa lỗi nhỏ
3. Không cần ý tưởng hoàn hảo — chỉ cần bắt đầu với cái có thể bán được

---

*Mình viết cái này để nhìn thật vào bản thân. Không phải để than phiền. Mà là để biết mình đang ở đâu, cần gì, và sợ gì — trước khi tiếp tục.*
