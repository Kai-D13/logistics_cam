# 🚀 Hướng dẫn Deploy lên Vercel

## 📋 Checklist trước khi deploy

- [x] Code đã được test kỹ trên local
- [x] Tất cả dependencies đã được cài đặt
- [x] Build thành công trên local (`npm run build`)
- [x] Có Mapbox Access Token
- [x] Code đã được push lên GitHub

## 🌐 BƯỚC 1: Chuẩn bị Vercel Account

### 1.1. Đăng ký/Đăng nhập Vercel
1. Truy cập: https://vercel.com/
2. Click **"Sign Up"** hoặc **"Login"**
3. Chọn **"Continue with GitHub"** để liên kết GitHub account
4. Authorize Vercel truy cập GitHub repositories

### 1.2. Cài đặt Vercel CLI (Optional)
```bash
npm install -g vercel
vercel login
```

---

## 📦 BƯỚC 2: Import Project vào Vercel

### 2.1. Từ Vercel Dashboard
1. Đăng nhập vào https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Trong phần **"Import Git Repository"**:
   - Tìm repository: `Kai131313/logistics_cam`
   - Click **"Import"**

### 2.2. Nếu không thấy repository
1. Click **"Adjust GitHub App Permissions"**
2. Grant access cho repository `logistics_cam`
3. Quay lại và import

---

## ⚙️ BƯỚC 3: Cấu hình Build Settings

### 3.1. Framework Preset
```
Framework Preset: Vite
```

### 3.2. Root Directory
```
Root Directory: frontend
```
⚠️ **QUAN TRỌNG:** Phải set `frontend` vì code React nằm trong thư mục này!

### 3.3. Build & Development Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

### 3.4. Node.js Version
```
Node.js Version: 18.x
```

---

## 🔐 BƯỚC 4: Environment Variables

### 4.1. Thêm Environment Variables
Trong phần **"Environment Variables"**, thêm:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_MAPBOX_TOKEN` | `pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw` | Production, Preview, Development |

### 4.2. Cách thêm
1. Scroll xuống phần **"Environment Variables"**
2. Nhập:
   - **Key:** `VITE_MAPBOX_TOKEN`
   - **Value:** Token của bạn
3. Chọn environments: **Production**, **Preview**, **Development** (chọn cả 3)
4. Click **"Add"**

### 4.3. Lấy Mapbox Token mới (nếu cần)
1. Truy cập: https://account.mapbox.com/access-tokens/
2. Click **"Create a token"**
3. Đặt tên: `Logistics Cambodia Production`
4. Scopes cần thiết:
   - ✅ `styles:read`
   - ✅ `fonts:read`
   - ✅ `datasets:read`
   - ✅ `vision:read`
5. Click **"Create token"**
6. Copy token và paste vào Vercel

---

## 🚀 BƯỚC 5: Deploy

### 5.1. Deploy lần đầu
1. Kiểm tra lại tất cả settings
2. Click **"Deploy"**
3. Đợi 2-3 phút để Vercel build và deploy

### 5.2. Theo dõi Build Process
Bạn sẽ thấy:
```
▲ Vercel
Building...
├── Installing dependencies
├── Running build command
├── Uploading build output
└── Deployment ready
```

### 5.3. Khi deploy thành công
- Vercel sẽ cung cấp URL: `https://logistics-cam.vercel.app`
- Click vào URL để xem website

---

## 🔍 BƯỚC 6: Kiểm tra Deployment

### 6.1. Test các tính năng
- [ ] Map hiển thị đúng
- [ ] Markers xuất hiện
- [ ] Routes được vẽ
- [ ] Dashboard hiển thị stats
- [ ] Tính năng "Tính khoảng cách" hoạt động
- [ ] Focus Mode hoạt động
- [ ] Toggle boundaries/routes hoạt động

### 6.2. Kiểm tra Console
1. Mở DevTools (F12)
2. Kiểm tra Console tab
3. Không có lỗi liên quan đến Mapbox token

### 6.3. Nếu có lỗi
**Lỗi thường gặp:**

#### Lỗi 1: "Mapbox token not found"
**Nguyên nhân:** Environment variable chưa được set
**Giải pháp:**
1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm `VITE_MAPBOX_TOKEN`
3. Redeploy: Deployments → ... → Redeploy

#### Lỗi 2: "404 Not Found" khi refresh
**Nguyên nhân:** Vercel chưa cấu hình SPA routing
**Giải pháp:** File `vercel.json` đã có sẵn, redeploy là được

#### Lỗi 3: Build failed
**Nguyên nhân:** Dependencies hoặc build command sai
**Giải pháp:**
1. Kiểm tra Build Logs trong Vercel
2. Đảm bảo Root Directory = `frontend`
3. Đảm bảo Build Command = `npm run build`

---

## 🔄 BƯỚC 7: Automatic Deployments

### 7.1. Cấu hình Auto Deploy
Vercel tự động deploy khi:
- ✅ Push code lên branch `main` → Deploy to Production
- ✅ Push code lên branch khác → Deploy to Preview
- ✅ Tạo Pull Request → Deploy Preview

### 7.2. Workflow
```bash
# Developer làm việc trên branch mới
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Vercel tự động tạo Preview Deployment
# URL: https://logistics-cam-git-feature-new-feature.vercel.app

# Sau khi merge vào main
git checkout main
git merge feature/new-feature
git push origin main

# Vercel tự động deploy lên Production
# URL: https://logistics-cam.vercel.app
```

---

## 🌍 BƯỚC 8: Custom Domain (Optional)

### 8.1. Thêm Custom Domain
1. Vào Project → Settings → Domains
2. Click **"Add"**
3. Nhập domain của bạn: `logistics.yourdomain.com`
4. Click **"Add"**

### 8.2. Cấu hình DNS
Vercel sẽ hướng dẫn thêm DNS records:

**Option 1: CNAME (Recommended)**
```
Type: CNAME
Name: logistics
Value: cname.vercel-dns.com
```

**Option 2: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 8.3. Đợi DNS propagate
- Thời gian: 5 phút - 48 giờ
- Kiểm tra: https://dnschecker.org/

---

## 👥 BƯỚC 9: Cấu hình cho Team

### 9.1. Invite Team Members
1. Vào Project → Settings → Team
2. Click **"Invite Member"**
3. Nhập email của đồng nghiệp
4. Chọn role:
   - **Owner:** Full access
   - **Member:** Deploy và view
   - **Viewer:** Chỉ xem

### 9.2. Phân quyền
```
Owner (Bạn):
- Quản lý settings
- Thêm/xóa members
- Quản lý billing

Members (Đồng nghiệp):
- View deployments
- Trigger redeploy
- View logs
- Comment on deployments

Viewers:
- Chỉ xem deployments
- Không thể deploy
```

### 9.3. Workflow cho Team
```bash
# Developer 1: Làm feature A
git checkout -b feature/feature-a
# ... code ...
git push origin feature/feature-a
# Vercel auto deploy preview

# Developer 2: Làm feature B
git checkout -b feature/feature-b
# ... code ...
git push origin feature/feature-b
# Vercel auto deploy preview

# Review và merge
# Vercel auto deploy to production
```

---

## 📊 BƯỚC 10: Monitoring & Analytics

### 10.1. Vercel Analytics
1. Vào Project → Analytics
2. Click **"Enable Analytics"**
3. Xem:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### 10.2. Deployment Logs
1. Vào Deployments
2. Click vào deployment
3. Xem:
   - Build logs
   - Function logs
   - Edge logs

### 10.3. Performance Monitoring
- **Web Vitals:** LCP, FID, CLS
- **Lighthouse Score:** Performance, Accessibility, SEO
- **Real User Monitoring (RUM)**

---

## 🔧 BƯỚC 11: Troubleshooting

### 11.1. Build Logs
Nếu build fail:
1. Vào Deployments → Failed deployment
2. Click **"View Build Logs"**
3. Tìm error message
4. Fix và push lại

### 11.2. Runtime Logs
Nếu app crash sau khi deploy:
1. Vào Deployments → Deployment → Functions
2. Xem Runtime Logs
3. Tìm error stack trace

### 11.3. Rollback
Nếu deployment mới có bug:
1. Vào Deployments
2. Tìm deployment cũ (working)
3. Click **"..."** → **"Promote to Production"**

---

## 📝 Checklist sau khi Deploy

- [ ] Website accessible tại Vercel URL
- [ ] Map hiển thị đúng với Mapbox token
- [ ] Tất cả tính năng hoạt động
- [ ] Console không có error
- [ ] Mobile responsive
- [ ] Performance tốt (Lighthouse > 90)
- [ ] Team members đã được invite
- [ ] Auto deployment đã được test
- [ ] Documentation đã được update

---

## 🎉 Hoàn thành!

Website của bạn đã live tại:
- **Production:** https://logistics-cam.vercel.app
- **Preview:** https://logistics-cam-git-[branch].vercel.app

Share link với team và bắt đầu phát triển! 🚀

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra [Vercel Documentation](https://vercel.com/docs)
2. Xem [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Contact Vercel Support (nếu có plan trả phí)

---

**Good luck! 🍀**

