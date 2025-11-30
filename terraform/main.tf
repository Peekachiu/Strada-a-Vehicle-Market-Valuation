provider "aws" {
  region = var.region
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

module "security" {
  source       = "./modules/security"
  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

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

module "compute" {
  source             = "./modules/compute"
  project_name       = var.project_name
  instance_type      = var.instance_type
  ami_id             = data.aws_ami.ubuntu.id
  ssh_key_name       = var.ssh_key_name
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  web_sg_id          = module.security.web_sg_id
  api_sg_id          = module.security.api_sg_id
}

module "public_alb" {
  source              = "./modules/alb"
  project_name        = var.project_name
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.public_subnet_ids
  security_group_id   = module.security.alb_sg_id
  target_instance_ids = module.compute.web_instance_ids
  name_prefix         = "public-alb"
}

module "internal_alb" {
  source              = "./modules/alb"
  project_name        = var.project_name
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_id   = module.security.internal_alb_sg_id
  target_instance_ids = module.compute.api_instance_ids
  internal            = true
  name_prefix         = "internal-alb"
}
