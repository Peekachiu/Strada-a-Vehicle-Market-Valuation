terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
}

variable "domain_name" {
  type        = string
  description = "The domain name to configure SES for"
}

variable "zone_id" {
  type        = string
  description = "Route53 Zone ID for DNS verification"
}

variable "project_name" {
  type        = string
  description = "Project name for tagging"
}
