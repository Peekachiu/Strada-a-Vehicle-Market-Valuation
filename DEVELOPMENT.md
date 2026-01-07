# Development & Deployment Guide 🛠️

This document contains the technical instructions for developers and system administrators to run, build, and deploy the Strada Vehicle Market Valuation platform.

## 🚀 Getting Started

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.
*   (Optional) Python 3.11+ for manual local development.

### Option 1: Run with Docker (Recommended)
The easiest way to get the whole system up and running.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/peekachiu/Strada-a-Vehicle-Market-Valuation.git
    cd Strada-a-Vehicle-Market-Valuation
    ```

2.  **Start the application:**
    ```bash
    docker-compose up --build
    ```
    *   **Frontend**: Accessible at `http://localhost:80`
    *   **Backend API**: Accessible at `http://localhost:8000`

### Option 2: Manual Setup (Local Dev)

**Backend:**
1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Create and activate virtual environment:
    ```powershell
    # Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```
    ```bash
    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations and start server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

---

## 🚢 Deployment & Workflow

### Docker Hub Workflow
Commands to build and push images to the registry.

**Backend Image**
```bash
# Login to Docker Hub
docker login

# Build & Tag
docker build -t peekachiu/strada-backend:v1 .

# Push to Hub
docker push peekachiu/strada-backend:v1
```

**Frontend Image (Nginx)**
```bash
# Build
docker build -t peekachiu/strada-frontend:v1 -f Dockerfile.nginx .

# Push
docker push peekachiu/strada-frontend:v1
```

### Database Management (AWS SSM)

**Step 1: Export Local Data**
```bash
cd backend
python manage.py dumpdata --natural-foreign --natural-primary --exclude contenttypes --exclude auth.permission --exclude admin.logentry --exclude sessions.session --indent 2 > strada_database.json
```

**Step 2: Connect to Server**
1.  Go to **AWS Console > EC2 > Instances**.
2.  Select your API instance (e.g., `strada-api...`).
3.  Click **Connect -> Session Manager -> Connect**.

**Step 3: Import Data on Server**
```bash
# Edit file (if needed)
sudo nano strada_database.json

# Copy file to container
sudo docker cp strada_database.json <CONTAINER_ID>:/app/strada_database.json

# Run migration
sudo docker exec -it <CONTAINER_ID> python manage.py migrate

# Load data
sudo docker exec -it <CONTAINER_ID> python manage.py loaddata strada_database.json
```
