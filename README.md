###############################################################
1. To start virtual environment: .\venv\Scripts\activate  
2. To start the website: python manage.py runserver

###############################################################
Start website with Docker
1. docker-compose up --build

###############################################################
To push Backend into Docker Hub
1. docker login
2. docker images ("Verify the name")
3. docker tag strada-a-vehicle-market-valuation-backend peekachiu/strada-backend:v1 ("Add a tag for the image)
4. docker push peekachiu/strada-backend:v1 ("Push it to Docker Hub")

###############################################################
For every changes in the code ("Push to Docker")

# Build it with your tag
docker build -t peekachiu/strada-backend:v1 .

# Push it to Docker Hub
docker push peekachiu/strada-backend:v1

------------------------------------------------

# Build it using the specific Nginx Dockerfile
docker build -t peekachiu/strada-frontend:v1 -f Dockerfile.nginx .

# Push it to Docker Hub
docker push peekachiu/strada-frontend:v1