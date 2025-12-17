variable "project_name" {
  description = "Project name"
  type        = string
}

variable "alb_dns_name" {
  description = "DNS name of the Public ALB"
  type        = string
}

variable "web_acl_id" {
  description = "ARN of the WAF Web ACL"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM Certificate ARN for HTTPS"
  type        = string
}

variable "aliases" {
  description = "List of CNAME aliases for the CloudFront distribution"
  type        = list(string)
  default     = []
}

variable "s3_bucket_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}
