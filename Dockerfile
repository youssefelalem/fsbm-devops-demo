# استخدام خادم Nginx خفيف وسريع
FROM nginx:alpine

# نسخ صفحة الويب إلى المسار الافتراضي للخادم
COPY index.html /usr/share/nginx/html/index.html

# فتح المنفذ 80
EXPOSE 80
