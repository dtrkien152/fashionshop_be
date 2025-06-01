#script
#docker build -t vebo/fashionshop_be:latest .
#docker tag vebo/fashionshop_be:latest dungsharker/fashionshop_be:latest
#docker push dungsharker/fashionshop_be:latest

# Sử dụng Node.js phiên bản LTS làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json trước để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies)
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript sang JavaScript
RUN npm run build

# Xóa node_modules và chỉ giữ lại dependencies cần thiết
#RUN rm -rf node_modules && npm install

# Copy file env.prod và đặt thành .env
COPY .env.dev .env

# Expose cổng chạy ứng dụng
EXPOSE 5000

# Chạy ứng dụng trong chế độ development
CMD ["npm", "run", "dev"]
