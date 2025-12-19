FROM nginx:alpine

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques
COPY public/ /usr/share/nginx/html/
COPY pages/ /usr/share/nginx/html/pages/

# Permissions
RUN chmod -R 755 /usr/share/nginx/html

# Port exposé
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
