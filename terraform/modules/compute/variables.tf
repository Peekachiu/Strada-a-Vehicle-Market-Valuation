variable "project_name" {
  description = "Project name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instances"
  type        = string
}



variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "web_sg_id" {
  description = "Security Group ID for Web Servers"
  type        = string
}

variable "api_sg_id" {
  description = "Security Group ID for API Servers"
  type        = string
}

variable "public_target_group_arn" {
  description = "ARN of the Public ALB Target Group"
  type        = string
}

variable "internal_target_group_arn" {
  description = "ARN of the Internal ALB Target Group"
  type        = string
}

variable "internal_alb_dns_name" {
  description = "DNS Name of the Internal ALB"
  type        = string
}

# DB Variables
variable "db_host" {
  description = "Database Host Address"
  type        = string
}

variable "db_port" {
  description = "Database Port"
  type        = number
}

variable "db_name" {
  description = "Database Name"
  type        = string
}

variable "db_username" {
  description = "Database Username"
  type        = string
}

variable "db_password" {
  description = "Database Password"
  type        = string
  sensitive   = true
}
