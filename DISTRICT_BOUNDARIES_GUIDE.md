# 📍 District Boundaries Visualization Guide

## 🎯 Mục đích

Tính năng **"Hiển thị ranh giới quận"** giúp bạn:
- ✅ Xem khu vực phủ sóng thực tế của mỗi hub
- ✅ Phát hiện khoảng trống trong coverage
- ✅ Đưa ra quyết định chính xác về vị trí hub mới
- ✅ So sánh kích thước và mật độ các quận
- ✅ Tối ưu hóa logistics network

---

## 🗺️ Cách sử dụng

### Bước 1: Chọn Hub
1. Click vào dropdown **"Chọn Hub"** ở Dashboard
2. Chọn hub bạn muốn phân tích (ví dụ: Hub Phnom Penh)

### Bước 2: Bật District Boundaries
1. Vào tab **"Hiển thị"** trong Dashboard
2. Check vào ✅ **"Hiển thị ranh giới quận"**
3. Map sẽ hiển thị ranh giới các quận có destinations của hub đó

### Bước 3: Phân tích Coverage
Quan sát:
- **Ranh giới đỏ chấm chấm**: Đường viền quận (giống Google Maps)
- **Màu fill nhạt**: Khu vực bên trong quận
- **Labels**: Tên quận + số destinations + tổng orders

---

## 📊 Thông tin hiển thị

### Labels trên mỗi quận
```
Mongkol Borei
10 destinations • 55 orders
```

**Ý nghĩa:**
- **Mongkol Borei**: Tên quận
- **10 destinations**: Số điểm giao hàng trong quận này
- **55 orders**: Tổng số đơn hàng/tháng

### Màu sắc
- **Fill color**: Mỗi quận có màu riêng (opacity 12%)
- **Outline**: Đỏ (#E74C3C) - dễ nhìn, giống Google Maps
- **Line style**: Dashed (chấm chấm) - professional

---

## 🎯 Cách đưa ra quyết định vị trí Hub mới

### 1. Phát hiện Coverage Gaps

**Cách làm:**
1. Chọn hub hiện tại (ví dụ: Hub Phnom Penh)
2. Bật "Hiển thị ranh giới quận"
3. Quan sát các quận **KHÔNG** được tô màu

**Ý nghĩa:**
- Quận **CÓ màu** = Hub hiện tại đang phục vụ
- Quận **KHÔNG màu** = Chưa có coverage
- **→ Đây là cơ hội mở hub mới!**

**Ví dụ:**
```
Hub Phnom Penh phủ sóng:
✅ Boeng Keng Kang (15 destinations)
✅ Chamkar Mon (12 destinations)
✅ Dangkao (8 destinations)

Các quận lân cận KHÔNG phủ sóng:
❌ Russey Keo
❌ Sen Sok
❌ Chroy Changvar

→ Cân nhắc mở hub mới tại Russey Keo hoặc Sen Sok
```

### 2. Phân tích Mật độ Destinations

**Cách làm:**
1. So sánh số destinations giữa các quận
2. Tìm quận có mật độ cao nhưng xa hub hiện tại

**Ví dụ:**
```
Hub Kandal:
- Kandal Stueng: 8 destinations, 45 orders
- Kien Svay: 6 destinations, 38 orders
- Lvea Aem: 4 destinations, 22 orders

→ Kandal Stueng có mật độ cao nhất
→ Nếu xa hub hiện tại, cân nhắc mở sub-hub
```

### 3. So sánh Coverage giữa các Hubs

**Cách làm:**
1. Chọn Hub A, bật boundaries → Screenshot
2. Chọn Hub B, bật boundaries → Screenshot
3. So sánh số quận và mật độ

**Ví dụ:**
```
Hub Phnom Penh:
- 14 quận
- 67 destinations
- Avg: 4.8 destinations/quận

Hub Kampong Cham:
- 10 quận
- 31 destinations
- Avg: 3.1 destinations/quận

→ Phnom Penh có mật độ cao hơn
→ Kampong Cham có tiềm năng mở rộng
```

### 4. Tìm vị trí tối ưu cho Hub mới

**Chiến lược:**

#### A. Hub cho khu vực chưa phủ sóng
```
Bước 1: Tìm cluster các quận chưa có coverage
Bước 2: Chọn quận trung tâm của cluster
Bước 3: Kiểm tra infrastructure (đường xá, dân số)
Bước 4: Đặt hub tại quận trung tâm
```

#### B. Sub-hub cho khu vực mật độ cao
```
Bước 1: Tìm quận có >10 destinations
Bước 2: Tính khoảng cách đến hub hiện tại
Bước 3: Nếu >30km, cân nhắc mở sub-hub
Bước 4: Đặt sub-hub tại quận đó
```

#### C. Hub cho khu vực biên giới
```
Bước 1: Tìm quận ở biên giới 2 provinces
Bước 2: Kiểm tra coverage của cả 2 provinces
Bước 3: Nếu cả 2 đều yếu, mở hub biên giới
Bước 4: Hub này phục vụ cả 2 provinces
```

---

## 📈 Case Study: Mở Hub mới tại Battambang

### Tình huống
- Hub Battambang hiện tại phủ sóng 8 quận
- Phát hiện 3 quận lân cận chưa có coverage
- Mỗi quận có tiềm năng 5-8 destinations

### Phân tích
```
Quận đã phủ sóng:
✅ Battambang (12 destinations, 68 orders)
✅ Banan (6 destinations, 34 orders)
✅ Thma Koul (5 destinations, 28 orders)

Quận chưa phủ sóng (lân cận):
❌ Moung Ruessei (tiềm năng: 6 destinations)
❌ Rotanak Mondol (tiềm năng: 5 destinations)
❌ Sangkae (tiềm năng: 7 destinations)

Khoảng cách:
- Moung Ruessei → Hub Battambang: 35km
- Rotanak Mondol → Hub Battambang: 42km
- Sangkae → Hub Battambang: 28km
```

### Quyết định
```
✅ MỞ SUB-HUB TẠI MOUNG RUESSEI

Lý do:
1. Khoảng cách 35km (quá xa cho delivery hiệu quả)
2. Có thể phục vụ cả 3 quận chưa coverage
3. Tiềm năng 18 destinations mới (6+5+7)
4. Giảm delivery time từ 2h xuống 45 phút

ROI dự kiến:
- Chi phí setup: $5,000
- Revenue tăng: $800/tháng (18 destinations × $45)
- Payback period: 6.25 tháng
```

---

## 🔍 Tips & Best Practices

### 1. Zoom Level
- **Zoom out** (level 7-8): Xem tổng quan coverage
- **Zoom in** (level 10-12): Xem chi tiết từng quận

### 2. So sánh nhiều Hubs
- Mở nhiều browser tabs
- Mỗi tab chọn 1 hub khác nhau
- So sánh coverage side-by-side

### 3. Export Screenshots
- Chụp màn hình coverage của mỗi hub
- Tạo presentation cho management
- Dễ dàng so sánh và thuyết trình

### 4. Kết hợp với Route Calculation
- Dùng "Tính khoảng cách" để tính delivery time
- Nếu >1 giờ, cân nhắc mở hub mới
- Tối ưu hóa delivery efficiency

### 5. Theo dõi theo thời gian
- Chụp screenshots hàng tháng
- Theo dõi sự thay đổi coverage
- Điều chỉnh chiến lược mở rộng

---

## 🎨 Visual Guide

### Màu sắc và ý nghĩa

```
🟢 Màu xanh lá nhạt = Quận có ít destinations (1-3)
🟡 Màu vàng nhạt = Quận có destinations trung bình (4-7)
🔴 Màu đỏ nhạt = Quận có nhiều destinations (8+)
⚪ Không màu = Quận chưa có coverage
```

### Đường viền

```
━━━ Đường liền = Ranh giới province
- - - Đường chấm đỏ = Ranh giới district (hub coverage)
```

---

## 📊 Metrics để theo dõi

### 1. Coverage Rate
```
Coverage Rate = (Số quận có coverage / Tổng số quận trong province) × 100%

Ví dụ:
Hub Phnom Penh: 14/25 quận = 56% coverage
→ Còn 44% tiềm năng mở rộng
```

### 2. Destination Density
```
Density = Số destinations / Số quận

Ví dụ:
Hub Kandal: 26 destinations / 11 quận = 2.4 destinations/quận
→ Mật độ thấp, cần tăng marketing
```

### 3. Average Distance
```
Avg Distance = Tổng khoảng cách / Số destinations

Ví dụ:
Hub Siemreap: 180km / 18 destinations = 10km/destination
→ Khoảng cách hợp lý, không cần sub-hub
```

---

## 🚀 Action Items

### Ngay lập tức
- [ ] Chọn top 3 hubs có revenue cao nhất
- [ ] Bật district boundaries cho mỗi hub
- [ ] Chụp screenshots và lưu lại

### Tuần này
- [ ] Phân tích coverage gaps
- [ ] List ra 5 quận tiềm năng nhất
- [ ] Tính toán ROI cho mỗi quận

### Tháng này
- [ ] Chọn 1-2 vị trí tốt nhất
- [ ] Survey thực địa
- [ ] Lập kế hoạch mở hub mới

---

## 📞 Support

Nếu cần hỗ trợ:
1. Check console log (F12) để xem matching status
2. Verify district names trong destinations.json
3. Kiểm tra districts.geojson có đầy đủ không

---

**✅ Chúc bạn thành công trong việc mở rộng logistics network!** 🚀

