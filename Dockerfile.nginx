# Use Nginx as the base
FROM nginx:alpine

# Copy your custom configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy your website files INSIDE the container
COPY public /usr/share/nginx/html

# Copy static assets (Ensure this path exists locally first!)
# If your static assets are already inside 'public/assets', you don't need this line.
# If 'static' is a separate folder in your root, keep this line.
COPY static /app/static