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

variable "ssh_key_name" {
  description = "Name of the existing AWS Key Pair"
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
