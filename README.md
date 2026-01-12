# Strada - Vehicle Market Valuation 🚗💰

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

**Empowering car owners with accurate, instant, and transparent vehicle valuations.**

Strada is a comprehensive platform designed to provide real-time vehicle market valuations using advanced data analysis. Beyond valuation, it offers a suite of financial tools to assist users in making informed decisions about vehicle ownership, financing, and maintenance.

---

## ✨ Features

### 📈 AI-Powered Valuation
Get instant market value estimates for vehicles based on real-time data analysis. Our system helps you understand the true worth of your vehicle in the current market.

### 💸 Financial Calculators
We provide a complete suite of tools to help you manage your vehicle finances:

*   **Loan Calculator**: Plan your finances by estimating monthly payments and total interest costs.
*   **Road Tax Calculator**: Easily calculate road tax requirements based on your vehicle's engine capacity and type.
*   **Insurance Estimator**: Get quick estimates on potential insurance premiums to avoid surprises.
*   **Affordability Calculator**: Smart tools to help you assess if a car fits comfortably within your budget.
*   **Depreciation Simulator**: Visualize reliable depreciation trends to understand long-term value retention.

### 📊 Interactive Dashboard
Experience your data through a dynamic interactive dashboard. We use advanced visualization to present market trends and analysis clearly, helping you spot opportunities and make better decisions.

### 🔐 Secure Authentication
Your data is safe with us. We bank-grade security practices and robust user management to ensure your personal information remains protected.

---

## �️ Tech Stack

Strada is built with modern, reliable technologies to ensure performance and scalability.

*   **Backend System**: Powered by **Django 5** and **Django Rest Framework**, ensuring a robust and secure API.
*   **Frontend Experience**: A responsive interface built with modern **HTML5, CSS3**, and **JavaScript**, featuring dynamic charts for data visualization.
*   **Infrastructure**: Containerized with **Docker** and hosted on **AWS (EC2 & RDS)** for high availability and reliability.
*   **Data Management**: Utilizing **PostgreSQL** for secure and efficient data storage.

---

## ☁️ Cloud Architecture

The system is deployed on AWS, leveraging Docker for containerization to ensure consistency across environments.

```mermaid
graph TD
    %% Define styles
    classDef dev fill:#4E79A7,stroke:#333,color:white,stroke-width:2px;
    classDef aws fill:#FF9900,stroke:#232f3e,color:white,stroke-width:2px;
    classDef docker fill:#2496ED,stroke:#333,color:white,stroke-width:2px;
    classDef db fill:#336791,stroke:#333,color:white,stroke-width:2px;
    classDef terraform fill:#7B42BC,stroke:#333,color:white,stroke-width:2px;

    %% 1. Development & Build Phase
    subgraph DevEnv [local_development]
        Git[🐱 Git Repository]:::dev
        Code[💻 Source Code]:::dev
        DevUser[👨‍💻 Developer]:::dev
        
        DevUser -->|1. Commit| Git
        Git -->|2. Build| DockerBuild[🐳 Docker Build]:::docker
    end

    %% 2. Artifact Registry
    subgraph DockerHub [registry]
        Hub[📦 Docker Hub]:::docker
    end

    DockerBuild -->|3. Push Images| Hub

    %% 3. Infrastructure Deployment
    subgraph IaC [infrastructure_as_code]
        TF[🚀 Terraform]:::terraform
    end

    DevUser -->|4. Deploy| TF

    %% 4. AWS Cloud Environment
    subgraph AWS [aws_cloud_environment]
        style AWS fill:#f9f9f9,stroke:#232f3e,stroke-width:2px

        subgraph Network [VPC]
            IGW[Internet Gateway]
            
            subgraph Public [Public Subnets]
                WAF[🛡️ AWS WAF]:::aws
                CF[⚡ CloudFront]:::aws
                ALB_Pub[Public ALB]:::aws
                NAT[NAT Gateway]
            end

            subgraph Private [Private Subnets]
                EC2_Web[🖥️ EC2 Web ASG]:::aws
                EC2_API[🖥️ EC2 API ASG]:::aws
                ALB_Int[Internal ALB]:::aws
                SSM[🔧 Systems Manager]:::aws
            end
            
            subgraph Data [Data Layer]
                RDS[(🗄️ PostgreSQL RDS)]:::db
                S3[🪣 S3 Assets]:::aws
            end
        end
    end

    %% Relationships
    TF -->|5. Provision| AWS
    Hub -->|6. Fetch Image| EC2_Web
    Hub -->|6. Fetch Image| EC2_API
    
    %% Traffic Flow
    User([👤 End User])
    User -->|HTTPS| CF
    CF --> WAF
    WAF --> ALB_Pub
    ALB_Pub --> EC2_Web
    EC2_Web --> ALB_Int
    ALB_Int --> EC2_API
    EC2_API --> RDS

    %% Database Migration
    SSM -->|7. Migrate DB| RDS
```

---

## 🚀 Getting Started

To explore the application locally or contribute to the development, please check our technical guide.

👉 **[View Developer Guide](DEVELOPMENT.md)** for installation, detailed commands, and deployment instructions.