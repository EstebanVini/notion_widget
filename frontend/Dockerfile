# Stage 1: Build React App
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
# Copy the custom nginx config to handle /api proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
