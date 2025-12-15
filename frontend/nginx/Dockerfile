# Use Nginx as the base
FROM nginx:alpine

# Copy custom configuration
# Copy custom configuration template
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy website files INSIDE the container
COPY public /usr/share/nginx/html

