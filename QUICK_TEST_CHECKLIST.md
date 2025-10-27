# ✅ Quick Test Checklist

**Localhost:** http://localhost:5173/  
**Status:** Dev server đang chạy ✅

---

## 🧪 Test nhanh (5 phút)

### 1. Test nút Đăng xuất (30 giây)
- [ ] Mở http://localhost:5173/
- [ ] Đăng nhập (password: `logistics2024`)
- [ ] Kiểm tra góc phải trên:
  - [ ] Nút "🚪 Đăng xuất" ở bên TRÁI
  - [ ] Badge "24 Hubs • 282 Destinations" ở bên PHẢI
  - [ ] Hai nút KHÔNG chồng lên nhau ✅

### 2. Test Phnom Penh destinations (1 phút)
- [ ] Chọn "Hub Phnom Penh" từ dropdown
- [ ] Zoom vào khu vực Phnom Penh
- [ ] Kiểm tra:
  - [ ] Thấy 67 destinations
  - [ ] Markers KHÔNG chồng lên nhau ✅
  - [ ] Click vào 2-3 markers khác nhau → Popup hiển thị đúng

### 3. Test Export CSV (3 phút)
- [ ] Chọn Hub: **Hub Phnom Penh**
- [ ] Filters:
  - [ ] Tỉnh: **Takeo**
  - [ ] Khoảng cách: **<= 30km**
- [ ] Click "Chọn tất cả" (sẽ chọn ~18 destinations)
- [ ] Click **"🧮 Tính khoảng cách"**
- [ ] Đợi kết quả hiển thị
- [ ] Kiểm tra:
  - [ ] Thấy nút **"📥 Xuất file CSV"** màu xanh lá ✅
  - [ ] Click nút → File CSV tự động download ✅
  - [ ] Mở file CSV → Hiển thị đúng trong Excel ✅

---

## ✅ Kết quả mong đợi

Nếu tất cả checkboxes đều ✅:
- **Task 1:** Phnom Penh destinations hiển thị đúng ✅
- **Task 2:** Nút Đăng xuất không đè lên badge ✅
- **Task 3:** Export CSV hoạt động ✅

→ **PASS!** Tất cả features hoạt động tốt! 🎉

---

## 🐛 Nếu có lỗi

### Lỗi 1: Nút vẫn đè lên nhau
→ Báo lại, tôi sẽ tăng `right` value

### Lỗi 2: Markers vẫn chồng
→ Check Console (F12), báo lại lỗi

### Lỗi 3: CSV không download
→ Check browser settings, thử browser khác

---

## 📖 Chi tiết

Xem file chi tiết:
- `UI_FIXES_TEST_GUIDE.md` - Test UI fixes
- `PHNOM_PENH_UPDATE_TEST_GUIDE.md` - Test Phnom Penh
- `SESSION_SUMMARY.md` - Tổng hợp toàn bộ

---

**Chúc bạn test thành công! 🚀**

