# 🤝 Contributing Guide

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án **Logistics Hub Optimization**! 

## 📋 Quy trình đóng góp

### 1. Setup môi trường phát triển

#### 1.1. Clone repository
```bash
git clone https://github.com/Kai131313/logistics_cam.git
cd logistics_cam
```

#### 1.2. Cài đặt dependencies
```bash
cd frontend
npm install
```

#### 1.3. Tạo file .env
```bash
# Copy file .env.example
cp .env.example .env

# Hoặc tạo file .env với nội dung:
echo "VITE_MAPBOX_TOKEN=pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw" > .env
```

#### 1.4. Chạy development server
```bash
npm run dev
```

Mở browser tại: http://localhost:5173/

---

### 2. Workflow phát triển

#### 2.1. Tạo branch mới
```bash
# Luôn tạo branch từ main
git checkout main
git pull origin main

# Tạo branch mới với tên mô tả
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-bug
```

**Quy tắc đặt tên branch:**
- `feature/` - Tính năng mới
- `fix/` - Sửa bug
- `refactor/` - Refactor code
- `docs/` - Cập nhật documentation
- `test/` - Thêm tests

**Ví dụ:**
- `feature/add-multiple-hubs`
- `fix/map-not-loading`
- `refactor/dashboard-components`
- `docs/update-readme`

#### 2.2. Làm việc trên branch
```bash
# Code, test, commit thường xuyên
git add .
git commit -m "Add: mô tả ngắn gọn"
```

**Quy tắc commit message:**
- `Add:` - Thêm tính năng mới
- `Fix:` - Sửa bug
- `Update:` - Cập nhật code hiện có
- `Refactor:` - Refactor code
- `Remove:` - Xóa code/file
- `Docs:` - Cập nhật documentation

**Ví dụ:**
```bash
git commit -m "Add: distance calculator feature"
git commit -m "Fix: map markers not showing"
git commit -m "Update: dashboard UI styling"
git commit -m "Refactor: extract boundary utils"
git commit -m "Docs: update deployment guide"
```

#### 2.3. Push branch lên GitHub
```bash
git push origin feature/ten-tinh-nang
```

#### 2.4. Tạo Pull Request
1. Vào GitHub repository
2. Click **"Compare & pull request"**
3. Điền thông tin:
   - **Title:** Mô tả ngắn gọn
   - **Description:** Mô tả chi tiết những gì đã làm
   - **Screenshots:** (nếu có thay đổi UI)
4. Click **"Create pull request"**

#### 2.5. Code Review
- Đợi team review
- Thực hiện các thay đổi nếu được yêu cầu
- Sau khi approved, merge vào main

---

### 3. Coding Standards

#### 3.1. JavaScript/React
```javascript
// ✅ GOOD: Component name PascalCase
const Dashboard = ({ markers, onCalculateDistance }) => {
  // ✅ GOOD: useState hooks ở đầu component
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ GOOD: useEffect có dependency array
  useEffect(() => {
    // logic
  }, [markers]);
  
  // ✅ GOOD: Function names camelCase, mô tả rõ ràng
  const handleCalculateDistance = async (destinations) => {
    // logic
  };
  
  return (
    // ✅ GOOD: JSX có indentation đúng
    <div>
      <h2>Dashboard</h2>
    </div>
  );
};

// ✅ GOOD: Export default ở cuối file
export default Dashboard;
```

#### 3.2. File Structure
```
frontend/src/
├── components/
│   ├── Dashboard.jsx       # Component chính
│   ├── Map.jsx
│   └── [ComponentName].jsx # PascalCase
├── utils/
│   ├── boundaries.js       # Utility functions
│   └── [utilName].js       # camelCase
├── App.jsx
└── main.jsx
```

#### 3.3. Naming Conventions
```javascript
// Components: PascalCase
Dashboard.jsx
Map.jsx
RouteCalculator.jsx

// Functions: camelCase
handleClick()
calculateDistance()
fetchRouteData()

// Constants: UPPER_SNAKE_CASE
const MAX_DISTANCE = 100;
const DEFAULT_ZOOM = 9;

// Variables: camelCase
const totalOrders = 150;
const isLoading = false;
```

#### 3.4. Comments
```javascript
// ✅ GOOD: Comment giải thích "tại sao", không phải "cái gì"
// Calculate distance using Haversine formula because Mapbox API has rate limit
const distance = calculateDistance(lat1, lon1, lat2, lon2);

// ❌ BAD: Comment mô tả code (code đã tự giải thích)
// Set total orders to sum of all orders
const totalOrders = markers.reduce((sum, m) => sum + m.order, 0);
```

---

### 4. Testing

#### 4.1. Test trước khi commit
```bash
# Build để kiểm tra lỗi
npm run build

# Chạy dev server và test thủ công
npm run dev
```

#### 4.2. Checklist test
- [ ] Map hiển thị đúng
- [ ] Markers xuất hiện
- [ ] Routes được vẽ
- [ ] Dashboard stats chính xác
- [ ] Tính năng mới hoạt động
- [ ] Không có lỗi trong Console
- [ ] Mobile responsive (nếu thay đổi UI)

---

### 5. Pull Request Guidelines

#### 5.1. Template PR Description
```markdown
## 📝 Mô tả
Mô tả ngắn gọn về những gì đã làm

## 🎯 Mục đích
Giải quyết vấn đề gì? Tính năng gì?

## 🔧 Thay đổi
- Thêm component X
- Sửa bug Y
- Refactor Z

## 📸 Screenshots (nếu có)
[Attach screenshots]

## ✅ Checklist
- [ ] Code đã được test
- [ ] Build thành công
- [ ] Không có lỗi console
- [ ] Documentation đã update (nếu cần)
```

#### 5.2. Review Process
1. **Self-review:** Tự review code của mình trước
2. **Request review:** Tag team members
3. **Address feedback:** Sửa theo góp ý
4. **Merge:** Sau khi approved

---

### 6. Git Best Practices

#### 6.1. Commit thường xuyên
```bash
# ✅ GOOD: Commit nhỏ, tập trung
git commit -m "Add: distance calculator UI"
git commit -m "Add: distance calculator logic"
git commit -m "Add: distance calculator tests"

# ❌ BAD: Commit lớn, nhiều thay đổi
git commit -m "Add everything"
```

#### 6.2. Pull trước khi push
```bash
# Luôn pull main trước khi push
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
# Resolve conflicts nếu có
git push origin feature/your-branch
```

#### 6.3. Rebase (Advanced)
```bash
# Nếu muốn history sạch hơn
git checkout feature/your-branch
git rebase main
# Resolve conflicts
git push origin feature/your-branch --force-with-lease
```

---

### 7. Quy tắc chung

#### 7.1. DO ✅
- Viết code rõ ràng, dễ đọc
- Comment khi cần thiết
- Test kỹ trước khi commit
- Commit message mô tả rõ ràng
- Tạo PR nhỏ, tập trung
- Review code của người khác
- Hỏi khi không chắc chắn

#### 7.2. DON'T ❌
- Commit code chưa test
- Push trực tiếp lên main
- Commit file .env
- Commit node_modules/
- Tạo PR quá lớn (>500 lines)
- Ignore review comments
- Hardcode sensitive data

---

### 8. Cấu trúc dữ liệu

#### 8.1. markers.json format
```json
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
```

#### 8.2. Thêm marker mới
1. Mở `frontend/public/markers.json`
2. Thêm object mới với format trên
3. Đảm bảo coordinates chính xác
4. Test trên map

---

### 9. Troubleshooting

#### 9.1. Map không hiển thị
```bash
# Kiểm tra .env file
cat .env
# Phải có: VITE_MAPBOX_TOKEN=...

# Restart dev server
npm run dev
```

#### 9.2. Build failed
```bash
# Clear cache và reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

#### 9.3. Git conflicts
```bash
# Pull latest main
git checkout main
git pull origin main

# Merge vào branch của bạn
git checkout feature/your-branch
git merge main

# Resolve conflicts trong editor
# Sau đó:
git add .
git commit -m "Merge: resolve conflicts with main"
git push origin feature/your-branch
```

---

### 10. Resources

#### 10.1. Documentation
- [React Docs](https://react.dev/)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Vite Docs](https://vitejs.dev/)

#### 10.2. Tools
- [VS Code](https://code.visualstudio.com/) - Editor
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug React
- [Git](https://git-scm.com/) - Version control

---

### 11. Contact

Nếu có câu hỏi:
1. Tạo issue trên GitHub
2. Hỏi trong team chat
3. Tag @Kai131313 trong PR

---

## 🎉 Cảm ơn bạn đã đóng góp!

Mọi đóng góp, dù lớn hay nhỏ, đều được trân trọng! 🙏

