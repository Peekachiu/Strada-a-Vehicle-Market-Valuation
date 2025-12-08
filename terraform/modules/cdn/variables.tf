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
  default     = "" # Optional if you want to deploy without WAF initially, or make it required.
}
