# 🧪 Hướng dẫn Test UI Fixes

**Ngày thực hiện:** 2025-10-27  
**Issues đã fix:** 2 issues

---

## ✅ Đã hoàn thành

### Issue 1: Fix nút "Đăng xuất" đè lên header
- ✅ Di chuyển nút "Đăng xuất" từ `right: 10px` sang `right: 200px`
- ✅ Thêm hover effect cho nút
- ✅ Không còn đè lên badge "24 Hubs - 282 Destinations"

### Issue 2: Thêm tính năng Export CSV
- ✅ Thêm nút "📥 Xuất file CSV" sau khi tính khoảng cách
- ✅ Export đầy đủ thông tin:
  - Hub xuất phát (ID, name, province, coordinates)
  - Filters đã áp dụng (province, district, ward, carrier type, distance)
  - Summary (tổng destinations, distance, duration, orders)
  - Chi tiết từng route (destination details, distance, duration, orders)
- ✅ Filename tự động: `route_calculation_{hub_name}_{timestamp}.csv`
- ✅ UTF-8 BOM encoding (mở được trong Excel)

---

## 🧪 Test Checklist

### 1. Test Issue 1: Nút Đăng xuất

#### Bước 1: Kiểm tra vị trí nút
- [ ] Mở http://localhost:5173/
- [ ] Đăng nhập (password: `logistics2024`)
- [ ] Kiểm tra góc phải trên header:
  - [ ] Nút "🚪 Đăng xuất" ở bên TRÁI
  - [ ] Badge "24 Hubs • 282 Destinations" ở bên PHẢI
  - [ ] Hai nút KHÔNG chồng lên nhau
  - [ ] Có khoảng cách rõ ràng giữa 2 nút

#### Bước 2: Kiểm tra hover effect
- [ ] Di chuột vào nút "Đăng xuất"
- [ ] Màu nền chuyển từ `#dc3545` (đỏ) sang `#c82333` (đỏ đậm hơn)
- [ ] Transition mượt mà

#### Bước 3: Kiểm tra chức năng
- [ ] Click nút "Đăng xuất"
- [ ] Quay về màn hình login
- [ ] Session bị xóa (không tự động login lại khi refresh)

---

### 2. Test Issue 2: Export CSV

#### Bước 1: Chuẩn bị dữ liệu (theo ví dụ của bạn)
- [ ] Chọn **Hub Phnom Penh** từ dropdown
- [ ] Bật **Cross-hub mode** (nếu cần)
- [ ] Áp dụng filters:
  - [ ] Tỉnh/Thành phố: **Takeo**
  - [ ] Quận/Huyện: **Tất cả quận (9)**
  - [ ] Xã/Phường: **Tất cả xã (18)**
  - [ ] Carrier types: **Tất cả carrier types**
  - [ ] Khoảng cách từ Hub: **<= 30km**
- [ ] Chọn điểm đến: **18/18** (click "Chọn tất cả")

#### Bước 2: Tính khoảng cách
- [ ] Click nút **"🧮 Tính khoảng cách (18)"**
- [ ] Đợi hệ thống tính toán (có thể mất vài giây)
- [ ] Kiểm tra kết quả hiển thị:
  - [ ] Tổng khoảng cách (km)
  - [ ] Tổng thời gian (giờ)
  - [ ] Tổng orders (orders/tháng)
  - [ ] Danh sách 18 routes với chi tiết

#### Bước 3: Kiểm tra nút Export CSV
- [ ] Sau khi có kết quả, kiểm tra nút **"📥 Xuất file CSV"**:
  - [ ] Nút hiển thị ngay dưới phần summary
  - [ ] Màu xanh lá (#28a745)
  - [ ] Full width
  - [ ] Icon 📥 và text "Xuất file CSV"

#### Bước 4: Test hover effect
- [ ] Di chuột vào nút "Xuất file CSV"
- [ ] Màu nền chuyển từ `#28a745` sang `#218838` (xanh đậm hơn)
- [ ] Transition mượt mà

#### Bước 5: Export CSV
- [ ] Click nút **"📥 Xuất file CSV"**
- [ ] File CSV tự động download
- [ ] Kiểm tra filename:
  - Format: `route_calculation_{hub_name}_{timestamp}.csv`
  - Ví dụ: `route_calculation_Hub_Phnom_Penh_2025-10-27T14-30-45.csv`

#### Bước 6: Kiểm tra nội dung CSV

**Mở file CSV trong Excel hoặc text editor:**

##### Section 1: Header
```csv
# LOGISTICS HUB OPTIMIZATION - ROUTE CALCULATION EXPORT
# Ngày xuất: 27/10/2025, 23:07:30
```
- [ ] Header hiển thị đúng
- [ ] Ngày giờ xuất chính xác

##### Section 2: Hub Information
```csv
# THÔNG TIN HUB XUẤT PHÁT
Hub ID,Hub Name,Province,Latitude,Longitude
hub_phnom_penh,Hub Phnom Penh,Phnom Penh,11.5564,104.9282
```
- [ ] Hub ID đúng
- [ ] Hub name đúng
- [ ] Province đúng
- [ ] Coordinates đúng

##### Section 3: Filters Applied
```csv
# BỘ LỌC ĐÃ ÁP DỤNG
Mode,Single-hub
Tỉnh/Thành phố,Takeo
Quận/Huyện,Tất cả
Xã/Phường,Tất cả
Carrier Type,Tất cả carrier types
Khoảng cách tối đa,<= 30km
```
- [ ] Mode đúng (Single-hub hoặc Cross-hub)
- [ ] Province filter đúng
- [ ] District filter đúng
- [ ] Ward filter đúng
- [ ] Carrier type filter đúng
- [ ] Distance filter đúng

##### Section 4: Summary
```csv
# TỔNG KẾT
Tổng số destinations,18
Tổng khoảng cách,XXX.XX km
Tổng thời gian,X.XX giờ
Tổng orders,XXX orders/tháng
```
- [ ] Số destinations đúng (18)
- [ ] Tổng khoảng cách khớp với UI
- [ ] Tổng thời gian khớp với UI
- [ ] Tổng orders khớp với UI

##### Section 5: Route Details
```csv
# CHI TIẾT TUYẾN ĐƯỜNG
STT,Destination ID,Destination Name,Ward,District,Province,Carrier Type,Distance (km),Duration (minutes),Orders/Month,Hub ID,Hub Name
1,dest_XXX,"Destination Name","Ward Name","District Name","Takeo",2PL,XX.XX,XX,XX,hub_phnom_penh,"Hub Phnom Penh"
2,dest_XXX,"Destination Name","Ward Name","District Name","Takeo",2PL,XX.XX,XX,XX,hub_phnom_penh,"Hub Phnom Penh"
...
18,dest_XXX,"Destination Name","Ward Name","District Name","Takeo",2PL,XX.XX,XX,XX,hub_phnom_penh,"Hub Phnom Penh"
```
- [ ] Có đủ 18 rows (theo số destinations đã chọn)
- [ ] STT đúng (1-18)
- [ ] Destination ID đúng
- [ ] Destination Name đúng (có dấu ngoặc kép)
- [ ] Ward, District, Province đúng
- [ ] Carrier Type đúng (2PL hoặc 3PL)
- [ ] Distance (km) đúng
- [ ] Duration (minutes) đúng
- [ ] Orders/Month đúng
- [ ] Hub ID đúng
- [ ] Hub Name đúng

#### Bước 7: Test với các scenarios khác

**Scenario 1: Cross-hub mode**
- [ ] Bật cross-hub mode
- [ ] Chọn destinations từ nhiều hubs khác nhau
- [ ] Tính khoảng cách
- [ ] Export CSV
- [ ] Kiểm tra:
  - [ ] Mode = "Cross-hub (Tất cả destinations)"
  - [ ] Hub ID và Hub Name khác nhau cho mỗi destination

**Scenario 2: Filters khác nhau**
- [ ] Thử với province khác (ví dụ: Kandal)
- [ ] Thử với district cụ thể
- [ ] Thử với carrier type = 2PL only
- [ ] Thử với distance <= 10km
- [ ] Export CSV và kiểm tra filters section

**Scenario 3: Số lượng destinations khác nhau**
- [ ] Chọn 1 destination → Export
- [ ] Chọn 5 destinations → Export
- [ ] Chọn 50 destinations → Export
- [ ] Kiểm tra file CSV có đủ rows

**Scenario 4: Hub khác**
- [ ] Chọn Hub Kandal
- [ ] Chọn destinations
- [ ] Tính khoảng cách
- [ ] Export CSV
- [ ] Kiểm tra hub information đúng

#### Bước 8: Test edge cases

**Edge Case 1: Chưa tính khoảng cách**
- [ ] Chọn hub và destinations
- [ ] KHÔNG click "Tính khoảng cách"
- [ ] Nút "Xuất file CSV" KHÔNG hiển thị (vì chưa có results)

**Edge Case 2: Tính lại khoảng cách**
- [ ] Tính khoảng cách lần 1 → Export CSV
- [ ] Thay đổi filters
- [ ] Tính khoảng cách lần 2 → Export CSV
- [ ] Kiểm tra 2 files CSV khác nhau

**Edge Case 3: Tên destination có ký tự đặc biệt**
- [ ] Chọn destinations có tên chứa dấu phẩy, dấu ngoặc kép
- [ ] Export CSV
- [ ] Kiểm tra CSV format đúng (tên được wrap trong dấu ngoặc kép)

---

## 📊 Kết quả mong đợi

### Issue 1: Nút Đăng xuất
✅ **PASS** nếu:
- Nút "Đăng xuất" và badge "24 Hubs - 282 Destinations" KHÔNG chồng lên nhau
- Có khoảng cách rõ ràng giữa 2 nút
- Hover effect hoạt động mượt mà
- Chức năng đăng xuất hoạt động bình thường

### Issue 2: Export CSV
✅ **PASS** nếu:
- Nút "Xuất file CSV" chỉ hiển thị sau khi tính khoảng cách
- Click nút → file CSV tự động download
- Filename đúng format với timestamp
- CSV chứa đầy đủ 5 sections:
  1. Header với ngày giờ
  2. Hub information
  3. Filters applied
  4. Summary
  5. Route details
- Mở được trong Excel (UTF-8 BOM)
- Dữ liệu chính xác, khớp với UI
- Hoạt động với mọi scenarios (cross-hub, filters, hubs khác nhau)

---

## 🐛 Nếu phát hiện lỗi

### Lỗi thường gặp:

**1. Nút Đăng xuất vẫn đè lên badge**
- Kiểm tra: `right: 200px` trong PasswordProtection.jsx
- Fix: Tăng giá trị `right` lên (ví dụ: 220px, 250px)

**2. File CSV không download**
- Kiểm tra Console (F12) có lỗi không
- Kiểm tra browser có block download không
- Thử browser khác

**3. File CSV mở trong Excel bị lỗi font**
- Đã có UTF-8 BOM (`\uFEFF`) ở đầu file
- Nếu vẫn lỗi, thử mở bằng Google Sheets

**4. Dữ liệu CSV không đúng**
- Kiểm tra `calculatedRoutes` có dữ liệu không
- Kiểm tra `destinations` array có đầy đủ không
- Check Console log

**5. Filename có ký tự lạ**
- Regex replace đã loại bỏ ký tự đặc biệt
- Nếu vẫn lỗi, check `selectedHub.name`

---

## 📸 Screenshots để kiểm tra

Hãy chụp screenshots các phần sau:

1. **Header với nút Đăng xuất** - Góc phải trên, thấy cả 2 nút không chồng
2. **Kết quả tính khoảng cách** - Thấy summary và nút "Xuất file CSV"
3. **Hover nút Export CSV** - Màu xanh đậm hơn
4. **File CSV trong Excel** - Mở được, hiển thị đúng
5. **Chi tiết routes trong CSV** - Zoom vào section route details

---

## 🚀 Sau khi test thành công

### Files đã thay đổi:
- ✅ `frontend/src/components/PasswordProtection.jsx` - Fix nút Đăng xuất
- ✅ `frontend/src/components/Dashboard.jsx` - Thêm Export CSV

### KHÔNG commit/push (theo yêu cầu)
Bạn đã yêu cầu: **"Build nhưng không push và commit lên git"**

### Nếu muốn commit sau này:
```bash
git add frontend/src/components/PasswordProtection.jsx
git add frontend/src/components/Dashboard.jsx
git commit -m "Fix: UI improvements - logout button position & CSV export feature"
```

---

## 📝 Technical Details

### Export CSV Implementation

**Function:** `handleExportCSV()`

**Features:**
1. **Metadata Section**
   - Export timestamp
   - Hub information (ID, name, province, coordinates)
   - Applied filters (mode, province, district, ward, carrier type, distance)

2. **Summary Section**
   - Total destinations
   - Total distance (km)
   - Total duration (hours)
   - Total orders/month

3. **Route Details Section**
   - STT (row number)
   - Destination ID
   - Destination Name (quoted)
   - Ward, District, Province (quoted)
   - Carrier Type
   - Distance (km, 2 decimals)
   - Duration (minutes, 0 decimals)
   - Orders/Month
   - Hub ID
   - Hub Name (quoted)

**CSV Format:**
- UTF-8 BOM encoding (`\uFEFF`)
- Comma-separated values
- Quoted strings for names with special characters
- Comments start with `#`

**Filename Format:**
```
route_calculation_{hub_name}_{timestamp}.csv
```
Example: `route_calculation_Hub_Phnom_Penh_2025-10-27T14-30-45.csv`

---

**Chúc bạn test thành công! 🎉**

Nếu có vấn đề gì, hãy báo lại để tôi hỗ trợ ngay!

