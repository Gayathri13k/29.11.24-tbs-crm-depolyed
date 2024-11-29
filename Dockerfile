# Use the official NGINX image
FROM nginx:stable-alpine

# Copy the build output from your React app to the NGINX HTML directory
COPY build /usr/share/nginx/html

# Copy a custom NGINX configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
