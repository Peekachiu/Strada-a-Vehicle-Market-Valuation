# Use Nginx as the base
FROM nginx:alpine

# Copy your custom configuration
# Copy your custom configuration template
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy your website files INSIDE the container
COPY public /usr/share/nginx/html

