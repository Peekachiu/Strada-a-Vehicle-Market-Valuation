# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# Copy the entire project into the container
COPY . /app/

# Expose the port Django runs on
EXPOSE 8000

# Run the application using Gunicorn (Production server)
CMD ["gunicorn", "strada_config.wsgi:application", "--bind", "0.0.0.0:8000"]