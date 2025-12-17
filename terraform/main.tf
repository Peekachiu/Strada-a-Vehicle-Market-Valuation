#####################################################################
# Terraform Configuration
#####################################################################
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
    http = {
      source  = "hashicorp/http"
      version = ">= 3.0.0"
    }
  }
}

#####################################################################
# Root Providers
#####################################################################
provider "aws" {
  region = var.region
}

#####################################################################
# WAF Providers
#####################################################################
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

#####################################################################
# Route 53 (DNS)
#####################################################################
module "route53" {
  source       = "./modules/route53"
  domain_name  = var.domain_name
  project_name = var.project_name

  providers = {
    aws.domains = aws.us_east_1
  }
}

import {
  to = module.route53.aws_route53domains_registered_domain.main
  id = "strada-automobile.click"
}

resource "aws_route53_record" "root" {
  zone_id = module.route53.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.cdn.cloudfront_domain_name
    zone_id                = module.cdn.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

#####################################################################
# ACM (SSL Certificate)
#####################################################################
module "acm" {
  source       = "./modules/acm"
  domain_name  = var.domain_name
  zone_id      = module.route53.zone_id
  project_name = var.project_name

  providers = {
    aws = aws.us_east_1
  }
}

#####################################################################
# Virtual Private Cloud
#####################################################################
module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

#####################################################################
# Security Groups
#####################################################################
module "security" {
  source       = "./modules/security"
  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

#####################################################################
# Secrets Manager
#####################################################################
module "secrets" {
  source       = "./modules/secrets"
  project_name = var.project_name
  db_password  = var.db_password
}

#####################################################################
# RDS Database
#####################################################################
module "database" {
  source             = "./modules/database"
  project_name       = var.project_name
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.security.rds_sg_id]
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

#####################################################################
# EC2 Instances
#####################################################################
module "compute" {
  source             = "./modules/compute"
  project_name       = var.project_name
  instance_type      = var.instance_type
  ami_id             = data.aws_ami.ubuntu.id
  # ssh_key_name removed as we use SSM
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  web_sg_id          = module.security.web_sg_id
  api_sg_id                 = module.security.api_sg_id
  public_target_group_arn   = module.public_alb.target_group_arn
  internal_target_group_arn = module.internal_alb.target_group_arn
  internal_alb_dns_name     = module.internal_alb.alb_dns_name

  # Database Connection
  db_host     = module.database.db_address
  db_port     = module.database.db_port
  db_name     = var.db_name
  db_username = var.db_username

  db_password_secret_arn  = module.secrets.secret_arn
  db_password_secret_name = module.secrets.secret_name
}

#####################################################################
# Public Load Balancers
#####################################################################
module "public_alb" {
  source              = "./modules/alb"
  project_name        = var.project_name
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.public_subnet_ids
  security_group_id   = module.security.alb_sg_id

  name_prefix         = "public-alb"
}

#####################################################################
# Internal Load Balancers
#####################################################################
module "internal_alb" {
  source              = "./modules/alb"
  project_name        = var.project_name
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_id   = module.security.internal_alb_sg_id

  internal            = true
  name_prefix         = "internal-alb"
  target_port         = 8000
}

#####################################################################
# Web Application Firewall (WAF)
#####################################################################
module "waf" {
  source       = "./modules/waf"
  project_name = var.project_name

  providers = {
    aws.waf_region = aws.us_east_1
  }
}

#####################################################################
# Cloudfront (CDN)
#####################################################################
module "cdn" {
  source              = "./modules/cdn"
  project_name        = var.project_name
  alb_dns_name        = module.public_alb.alb_dns_name
  web_acl_id          = module.waf.web_acl_arn
  acm_certificate_arn = module.acm.certificate_arn
  aliases             = [var.domain_name]
  s3_bucket_domain_name = module.storage.bucket_regional_domain_name
}

#####################################################################
# S3 Storage (Static Assets)
#####################################################################
module "storage" {
  source       = "./modules/storage"
  project_name = var.project_name
  assets_dir   = "${path.module}/../frontend/public/assets/images"
}

resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = module.storage.bucket_id
  policy = data.aws_iam_policy_document.allow_cloudfront.json
}

data "aws_iam_policy_document" "allow_cloudfront" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::${module.storage.bucket_id}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.cdn.cloudfront_distribution_arn]
    }
  }
}

#####################################################################
# CloudWatch Monitoring
#####################################################################
module "monitoring" {
  source       = "./modules/monitoring"
  project_name = var.project_name
  region       = var.region

  web_asg_name = module.compute.web_asg_name
  api_asg_name = module.compute.api_asg_name

  db_instance_id = module.database.db_instance_id

  public_alb_arn_suffix  = module.public_alb.alb_arn_suffix
  public_tg_arn_suffix   = module.public_alb.target_group_arn_suffix
  
  internal_alb_arn_suffix = module.internal_alb.alb_arn_suffix
  internal_tg_arn_suffix  = module.internal_alb.target_group_arn_suffix
}

