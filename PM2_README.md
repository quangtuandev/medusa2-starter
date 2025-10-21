# Hướng dẫn sử dụng PM2 cho Medusa2-starter

## Cài đặt PM2

```bash
npm install -g pm2
```

## Các lệnh PM2 cơ bản

### Khởi động tất cả ứng dụng
```bash
pm2 start ecosystem.config.js
```

### Khởi động từng ứng dụng riêng lẻ
```bash
# Khởi động Medusa backend
pm2 start ecosystem.config.js --only medusa-backend

# Khởi động Storefront
pm2 start ecosystem.config.js --only storefront
```

### Dừng ứng dụng
```bash
# Dừng tất cả
pm2 stop all

# Dừng theo tên
pm2 stop medusa-backend
pm2 stop storefront
```

### Restart ứng dụng
```bash
# Restart tất cả
pm2 restart all

# Restart theo tên
pm2 restart medusa-backend
pm2 restart storefront
```

### Xem trạng thái
```bash
pm2 status
pm2 list
```

### Xem logs
```bash
# Xem logs tất cả
pm2 logs

# Xem logs theo tên
pm2 logs medusa-backend
pm2 logs storefront

# Xem logs realtime
pm2 logs --follow
```

### Xóa ứng dụng khỏi PM2
```bash
pm2 delete medusa-backend
pm2 delete storefront
pm2 delete all
```

### Khởi động lại PM2 sau khi restart server
```bash
pm2 startup
pm2 save
```

## Cấu hình

- **Medusa Backend**: Chạy trên port 7901
- **Storefront**: Chạy trên port 3000
- **Logs**: Được lưu trong thư mục `./logs/`

## Môi trường

- **Development**: Sử dụng `pm2 start ecosystem.config.js`
- **Production**: Sử dụng `pm2 start ecosystem.config.js --env production`

## Monitoring

```bash
# Xem thông tin chi tiết
pm2 show medusa-backend
pm2 show storefront

# Monitoring dashboard
pm2 monit
```

## Troubleshooting

### Nếu ứng dụng không khởi động được:
1. Kiểm tra logs: `pm2 logs [app-name]`
2. Kiểm tra port có bị chiếm không: `lsof -i :7901` hoặc `lsof -i :3000`
3. Kiểm tra dependencies đã cài đặt chưa: `npm install`

### Reset PM2:
```bash
pm2 kill
pm2 start ecosystem.config.js
```
