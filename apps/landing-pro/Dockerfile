FROM nginx:alpine

# Copy landing page
COPY index.html /usr/share/nginx/html/

# Create nginx config for SPA
RUN echo 'server { \
    listen 8216; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8216

CMD ["nginx", "-g", "daemon off;"]
