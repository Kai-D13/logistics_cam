# 🧪 Hướng dẫn Test Update Tọa độ Phnom Penh

## ✅ Đã hoàn thành

1. ✅ **Updated 67 destinations** của Phnom Penh với tọa độ chính xác
2. ✅ **Loại bỏ tất cả duplicate coordinates**
3. ✅ **Backup file** đã được tạo tại `frontend/public/destinations.backup.json`
4. ✅ **Dev server** đang chạy tại http://localhost:5173/

---

## 📋 Checklist Test

### 1. Kiểm tra Map Load
- [ ] Map hiển thị đúng
- [ ] Không có lỗi trong Console (F12)
- [ ] Hub Phnom Penh xuất hiện trên map

### 2. Kiểm tra Hub Phnom Penh
- [ ] Click vào **Hub Phnom Penh** trên map (marker màu đỏ)
- [ ] Popup hiển thị thông tin:
  - 🏭 Hub Phnom Penh
  - 📦 67 Destinations
  - 📊 Orders/tháng: ~1,800+

### 3. Kiểm tra Destinations không còn Duplicate
**Trước đây (BỊ LỖI):**
- Nhiều destinations cùng tọa độ → markers chồng lên nhau
- Ví dụ: dest_135, dest_136 cùng tại `11.568271, 104.922443`

**Bây giờ (ĐÃ FIX):**
- [ ] Chọn Hub Phnom Penh từ dropdown
- [ ] Zoom vào khu vực Phnom Penh
- [ ] Kiểm tra các markers **KHÔNG còn chồng lên nhau**
- [ ] Mỗi destination có tọa độ riêng biệt

### 4. Kiểm tra từng District

#### District: Boeng Keng Kang
- [ ] **dest_135** - Boeng Keng Kang Ti Pir
  - Tọa độ mới: `11.553229, 104.916576`
  - Orders: 13/tháng
- [ ] **dest_136** - Tuol Svay Prey Ti Pir
  - Tọa độ mới: `11.553219, 104.907113`
  - Orders: 7/tháng
- [ ] Hai markers này **PHẢI ở vị trí khác nhau** (không chồng)

#### District: Chamkar Mon
- [ ] **dest_137** - Boeng Trabaek: `11.539296, 104.919363`
- [ ] **dest_138** - Tuol Tumpung Ti Muoy: `11.538744, 104.917056`
- [ ] **dest_139** - Tuol Tumpung Ti Pir: `11.541725, 104.910589`
- [ ] Ba markers này **PHẢI ở vị trí khác nhau**

#### District: Chbar Ampov (7 destinations)
- [ ] **dest_140** - Chbar Ampov Ti Pir: `11.534945, 104.939282`
- [ ] **dest_141** - Kbal Kaoh: `11.508764, 104.999624`
- [ ] **dest_142** - Nirouth: `11.531031, 104.960994`
- [ ] **dest_143** - Preaek Aeng: `11.521813, 104.984652`
- [ ] **dest_144** - Preaek Pra: `11.504331, 104.947536`
- [ ] **dest_145** - Preaek Thmei: `11.470271, 104.990929`
- [ ] **dest_146** - Veal Sbov: `11.526332, 104.971094`
- [ ] Tất cả 7 markers **PHẢI ở vị trí khác nhau**

#### District: Dangkao (7 destinations)
- [ ] **dest_150** - Cheung Aek: `11.496116, 104.899405`
- [ ] **dest_151** - Dangkao: `11.495558, 104.886291` (78 orders - marker lớn)
- [ ] **dest_152** - Krang Pongro: `11.443078, 104.808127`
- [ ] **dest_153** - Pong Tuek: `11.474041, 104.835856`
- [ ] **dest_154** - Prey Sa: `11.491927, 104.858344`
- [ ] **dest_155** - Roluos: `11.483839, 104.900814`
- [ ] **dest_156** - Spean Thma: `11.469302, 104.868055`

#### District: Pur SenChey (7 destinations - HIGH VOLUME)
- [ ] **dest_178** - Chaom Chau 1: `11.524696, 104.852662` (105 orders - marker rất lớn)
- [ ] **dest_179** - Chaom Chau 2: `11.540160, 104.824825` (92 orders - marker lớn)
- [ ] **dest_180** - Chaom Chau 3: `11.538112, 104.832298` (41 orders)
- [ ] **dest_181** - Kakab 1: `11.558086, 104.860580` (32 orders)
- [ ] **dest_182** - Kakab 2: `11.539469, 104.833221` (11 orders)
- [ ] **dest_183** - Samraong Kraom: `11.572828, 104.809462` (31 orders)
- [ ] **dest_184** - Trapeang Krasang: `11.555932, 104.798542` (8 orders)

### 5. Kiểm tra Dynamic Marker Sizing
- [ ] Destinations với nhiều orders có marker **LỚN HƠN**
  - dest_178 (105 orders) → marker ~20px
  - dest_179 (92 orders) → marker ~18px
  - dest_151 (78 orders) → marker ~17px
- [ ] Destinations với ít orders có marker **NHỎ HƠN**
  - dest_145 (5 orders) → marker ~5px
  - dest_159 (5 orders) → marker ~5px

### 6. Kiểm tra Popup Information
Click vào bất kỳ destination nào và kiểm tra popup hiển thị:
- [ ] 📍 Tên destination
- [ ] 🏠 Địa chỉ đầy đủ
- [ ] 🏭 Hub: Hub Phnom Penh
- [ ] 🏢 Carrier Type: 2PL (màu xanh)
- [ ] 📦 Orders/tháng
- [ ] 📏 Khoảng cách từ hub (nếu có)

### 7. Kiểm tra Route Calculation
- [ ] Chọn Hub Phnom Penh
- [ ] Chọn 3-5 destinations
- [ ] Click "Tính khoảng cách"
- [ ] Routes được vẽ trên map
- [ ] Kết quả hiển thị:
  - Tổng khoảng cách (km)
  - Tổng thời gian (phút)
  - Tổng orders

### 8. Kiểm tra Filters
- [ ] **Province Filter**: Chọn "Phnom Penh" → Hiển thị 67 destinations
- [ ] **District Filter**: 
  - Chọn "Boeng Keng Kang" → 2 destinations
  - Chọn "Chamkar Mon" → 3 destinations
  - Chọn "Chbar Ampov" → 7 destinations
  - Chọn "Dangkao" → 7 destinations
  - Chọn "Pur SenChey" → 7 destinations
- [ ] **Carrier Type**: Chọn "2PL" → Tất cả 67 destinations (vì tất cả đều là 2PL)
- [ ] **Distance Filter**: Thử các giá trị 10km, 20km, 30km

### 9. Kiểm tra Console Errors
- [ ] Mở Console (F12)
- [ ] **KHÔNG có lỗi màu đỏ**
- [ ] Có thể có warnings (màu vàng) - OK
- [ ] Kiểm tra Network tab: Tất cả requests thành công (200)

### 10. Kiểm tra Performance
- [ ] Map load < 3 giây
- [ ] Zoom in/out mượt mà (60fps)
- [ ] Click markers phản hồi nhanh
- [ ] Route calculation < 5 giây cho 5 destinations

---

## 🔍 So sánh Trước/Sau

### TRƯỚC (Bị duplicate):
```
dest_135: 11.568271, 104.922443
dest_136: 11.568271, 104.922443  ← DUPLICATE!
```
→ Hai markers chồng lên nhau, không thể click riêng biệt

### SAU (Đã fix):
```
dest_135: 11.553229, 104.916576
dest_136: 11.553219, 104.907113  ← UNIQUE!
```
→ Hai markers ở vị trí khác nhau, có thể click riêng biệt

---

## ⚠️ Nếu phát hiện lỗi

### Restore từ backup:
```bash
# Windows PowerShell
Copy-Item frontend/public/destinations.backup.json frontend/public/destinations.json

# Hoặc Git
git checkout frontend/public/destinations.json
```

### Xem log chi tiết:
```bash
# Xem script output
node scripts/update-phnom-penh-coordinates.js
```

---

## ✅ Kết quả mong đợi

Sau khi test xong, bạn sẽ thấy:

1. ✅ **67 destinations** của Phnom Penh hiển thị đúng vị trí
2. ✅ **Không còn markers chồng lên nhau**
3. ✅ **Mỗi destination có tọa độ unique**
4. ✅ **Popup hiển thị thông tin chính xác**
5. ✅ **Route calculation hoạt động bình thường**
6. ✅ **Filters hoạt động đúng**
7. ✅ **Performance tốt, không lag**

---

## 📸 Screenshots để kiểm tra

Hãy chụp screenshots các vùng sau để so sánh:

1. **Overview Phnom Penh** - Zoom out để thấy tất cả 67 destinations
2. **District Boeng Keng Kang** - Zoom in để thấy dest_135 và dest_136 **không chồng**
3. **District Chbar Ampov** - Zoom in để thấy 7 destinations **không chồng**
4. **District Pur SenChey** - Zoom in để thấy markers có kích thước khác nhau (theo orders)
5. **Popup example** - Click vào 1 destination để thấy thông tin đầy đủ

---

## 🚀 Sau khi test thành công

### KHÔNG commit/push ngay (theo yêu cầu)
Bạn đã yêu cầu: "Build nhưng không push và commit lên git"

### Nếu muốn build production:
```bash
cd frontend
npm run build
```

### Nếu muốn commit sau này:
```bash
git add frontend/public/destinations.json
git commit -m "Fix: Update Phnom Penh destinations coordinates - remove duplicates"
```

---

## 📞 Liên hệ

Nếu có vấn đề gì, hãy báo lại để tôi hỗ trợ!

**Files đã thay đổi:**
- ✅ `frontend/public/destinations.json` - Updated 67 destinations
- ✅ `frontend/public/destinations.backup.json` - Backup file (NEW)
- ✅ `scripts/update-phnom-penh-coordinates.js` - Update script (NEW)

**Files KHÔNG thay đổi:**
- ✅ Source code (App.jsx, Map.jsx, Dashboard.jsx)
- ✅ Other provinces' destinations
- ✅ Hubs data
- ✅ Districts GeoJSON

---

**Chúc bạn test thành công! 🎉**

