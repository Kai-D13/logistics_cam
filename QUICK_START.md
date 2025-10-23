# 🚀 Quick Start Guide

## ⚡ Push code lên GitHub (LẦN ĐẦU)

Repository đã được khởi tạo và commit. Bây giờ chỉ cần push:

```bash
git push -u origin main
```

**Lưu ý:** Bạn sẽ cần đăng nhập GitHub. Nếu dùng HTTPS, có thể cần Personal Access Token.

### Nếu gặp lỗi authentication:

#### Option 1: Dùng GitHub CLI (Recommended)
```bash
# Cài đặt GitHub CLI: https://cli.github.com/
gh auth login
git push -u origin main
```

#### Option 2: Dùng Personal Access Token
1. Vào GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Chọn scopes: `repo` (full control)
4. Copy token
5. Khi push, dùng token làm password

---

## 📦 Sau khi push thành công

### 1. Verify trên GitHub
1. Vào: https://github.com/Kai131313/logistics_cam
2. Kiểm tra tất cả files đã được push
3. Đọc README.md

### 2. Deploy lên Vercel
Làm theo hướng dẫn trong file **`DEPLOYMENT_GUIDE.md`**

**Tóm tắt:**
1. Đăng nhập Vercel: https://vercel.com/
2. Import project: `Kai131313/logistics_cam`
3. Settings:
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**
4. Environment Variables:
   - Key: `VITE_MAPBOX_TOKEN`
   - Value: `pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw`
5. Click **Deploy**

---

## 👥 Invite đồng nghiệp

### Trên GitHub:
1. Vào repository: https://github.com/Kai131313/logistics_cam
2. Settings → Collaborators
3. Click "Add people"
4. Nhập username/email của đồng nghiệp
5. Chọn role: **Write** (để họ có thể push code)

### Trên Vercel:
1. Vào project trong Vercel Dashboard
2. Settings → Team
3. Click "Invite Member"
4. Nhập email
5. Chọn role: **Member**

---

## 🔧 Đồng nghiệp setup môi trường

Gửi hướng dẫn này cho đồng nghiệp:

### 1. Clone repository
```bash
git clone https://github.com/Kai131313/logistics_cam.git
cd logistics_cam/frontend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Tạo file .env
```bash
# Copy từ .env.example
cp .env.example .env

# Hoặc tạo trực tiếp
echo "VITE_MAPBOX_TOKEN=pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw" > .env
```

### 4. Chạy dev server
```bash
npm run dev
```

Mở browser: http://localhost:5173/

### 5. Workflow làm việc
```bash
# Tạo branch mới
git checkout -b feature/ten-tinh-nang

# Code và commit
git add .
git commit -m "Add: mô tả"

# Push lên GitHub
git push origin feature/ten-tinh-nang

# Tạo Pull Request trên GitHub
```

Đọc thêm trong **`CONTRIBUTING.md`**

---

## 📚 Documents quan trọng

| File | Mục đích |
|------|----------|
| **README.md** | Tổng quan dự án, tính năng, cài đặt |
| **DEPLOYMENT_GUIDE.md** | Hướng dẫn deploy lên Vercel chi tiết |
| **CONTRIBUTING.md** | Quy tắc đóng góp code cho team |
| **SCALING_GUIDE.md** | Hướng dẫn scale app (nhiều hub, boundaries thực) |
| **QUICK_START.md** | File này - Hướng dẫn nhanh |

---

## ✅ Checklist hoàn thành

- [ ] Push code lên GitHub
- [ ] Verify files trên GitHub
- [ ] Deploy lên Vercel
- [ ] Test website trên Vercel URL
- [ ] Invite đồng nghiệp trên GitHub
- [ ] Invite đồng nghiệp trên Vercel
- [ ] Share repository link với team
- [ ] Share Vercel URL với team
- [ ] Hướng dẫn team setup môi trường

---

## 🎉 Hoàn thành!

**Repository:** https://github.com/Kai131313/logistics_cam

**Vercel URL:** (sẽ có sau khi deploy)

**Next steps:**
1. Test tất cả tính năng trên production
2. Share với team
3. Bắt đầu phát triển tính năng mới!

---

## 🆘 Cần giúp đỡ?

- **GitHub Issues:** https://github.com/Kai131313/logistics_cam/issues
- **Vercel Docs:** https://vercel.com/docs
- **Mapbox Docs:** https://docs.mapbox.com/

Good luck! 🚀

