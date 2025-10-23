# 🗺️ Logistics Hub Optimization - Cambodia

Ứng dụng tối ưu hóa logistics cho Banteay Meanchey Province, Cambodia. Hệ thống giúp quản lý và tối ưu hóa các tuyến đường giao hàng từ Hub Poipet đến các điểm đến trong khu vực.

![Logistics Map](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Mapbox](https://img.shields.io/badge/Mapbox-GL-green)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## ✨ Tính năng chính

### 📊 Dashboard & Thống kê
- Tổng quan về số lượng hub và đơn hàng
- Thống kê điểm giao hàng xa nhất
- Top 5 hub có đơn hàng nhiều nhất
- Tổng khoảng cách giao hàng

### 🗺️ Bản đồ tương tác
- **Hiển thị Hub Poipet** (điểm xuất phát chính)
- **Markers cho các điểm đến** với màu sắc theo xã
- **Routes thực tế** từ Mapbox Directions API
- **Vùng xã (boundaries)** với màu sắc phân biệt
- **Popup chi tiết** cho mỗi điểm:
  - Địa chỉ đầy đủ
  - Số đơn hàng/tháng
  - Diện tích khu vực
  - Khoảng cách (km)
  - Thời gian di chuyển (phút)

### 📏 Tính khoảng cách (Distance Calculator)
- Chọn nhiều điểm đến cùng lúc
- Tính khoảng cách thực tế bằng Mapbox Directions API
- Hiển thị thời gian di chuyển ước tính
- Tổng khoảng cách cho tất cả các điểm đã chọn

### 🎯 Focus Mode
- **Chế độ tập trung** khi tính khoảng cách
- Chỉ hiển thị các điểm đã chọn
- Map tự động zoom vào vùng quan tâm
- Dễ dàng thoát về chế độ xem tất cả

### 🗺️ Điều khiển bản đồ
- Toggle hiển thị/ẩn vùng xã (boundaries)
- Toggle hiển thị/ẩn routes
- Dễ dàng tùy chỉnh visualization

## 🚀 Cài đặt & Chạy dự án

### Prerequisites
- Node.js >= 18.x
- npm hoặc yarn
- Mapbox Access Token

### 1. Clone repository
```bash
git clone https://github.com/Kai131313/logistics_cam.git
cd logistics_cam
```

### 2. Cài đặt dependencies
```bash
cd frontend
npm install
```

### 3. Cấu hình Mapbox Token
Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

**Lấy Mapbox Token:**
1. Đăng ký tài khoản tại [mapbox.com](https://www.mapbox.com/)
2. Vào [Account > Access Tokens](https://account.mapbox.com/access-tokens/)
3. Copy token hoặc tạo token mới

### 4. Chạy development server
```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173/`

### 5. Build cho production
```bash
npm run build
```

Output sẽ ở thư mục `frontend/dist/`

## 📁 Cấu trúc dự án

```
logistics_cam/
├── frontend/
│   ├── public/
│   │   └── markers.json          # Dữ liệu markers và routes
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Dashboard với stats và controls
│   │   │   └── Map.jsx           # Mapbox map component
│   │   ├── utils/
│   │   │   └── boundaries.js     # Utilities cho boundaries
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Styles
│   │   └── main.jsx              # Entry point
│   ├── .env                      # Environment variables (không commit)
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🌐 Deploy lên Vercel

### Bước 1: Chuẩn bị
1. Đảm bảo code đã được push lên GitHub
2. Có tài khoản [Vercel](https://vercel.com/)

### Bước 2: Import Project
1. Đăng nhập vào Vercel
2. Click **"Add New Project"**
3. Import repository: `Kai131313/logistics_cam`

### Bước 3: Cấu hình Build Settings
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Bước 4: Environment Variables
Thêm biến môi trường trong Vercel:

| Key | Value |
|-----|-------|
| `VITE_MAPBOX_TOKEN` | `pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw` |

### Bước 5: Deploy
Click **"Deploy"** và đợi vài phút!

### Bước 6: Cấu hình Custom Domain (Optional)
- Vào **Settings > Domains**
- Thêm domain của bạn

## 🔧 Cấu hình cho team

### 1. Clone và setup
```bash
git clone https://github.com/Kai131313/logistics_cam.git
cd logistics_cam/frontend
npm install
```

### 2. Tạo file .env
```bash
# Tạo file .env trong frontend/
echo "VITE_MAPBOX_TOKEN=pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw" > .env
```

### 3. Chạy dev server
```bash
npm run dev
```

### 4. Workflow phát triển
```bash
# Tạo branch mới cho feature
git checkout -b feature/ten-tinh-nang

# Làm việc và commit
git add .
git commit -m "Add: mô tả tính năng"

# Push lên GitHub
git push origin feature/ten-tinh-nang

# Tạo Pull Request trên GitHub
```

## 📊 Dữ liệu

### Format của markers.json
```json
[
  {
    "hub_departer": "Hub Poipet",
    "hub_destination": "Thma Puok",
    "departer_lat": 13.6281,
    "departer_long": 102.6770,
    "destination_lat": 13.6500,
    "destination_long": 102.5800,
    "address_destination": "Thma Puok, Banteay Meanchey, Cambodia",
    "order": 150
  }
]
```

### Thêm dữ liệu mới
1. Mở `frontend/public/markers.json`
2. Thêm object mới với format trên
3. Save và refresh browser

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3
- **Build Tool:** Vite 5.4
- **Map Library:** Mapbox GL JS
- **Routing API:** Mapbox Directions API
- **Styling:** CSS (inline styles)
- **Deployment:** Vercel

## 📝 Roadmap

- [ ] Tách data thành 3 files: `hubs.json`, `destinations.json`, `commune_boundaries.json`
- [ ] Thêm nhiều hub xuất phát
- [ ] Tính năng so sánh routes giữa các hub
- [ ] Export báo cáo PDF
- [ ] Tích hợp database (Supabase/Firebase)
- [ ] Authentication cho team members
- [ ] Real-time collaboration

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết

## 👥 Team

- **Developer:** Kai131313
- **Contact:** [GitHub](https://github.com/Kai131313)

## 🙏 Acknowledgments

- [Mapbox](https://www.mapbox.com/) - Map và routing API
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Vercel](https://vercel.com/) - Deployment platform

---

**Made with ❤️ for Cambodia Logistics Optimization**

