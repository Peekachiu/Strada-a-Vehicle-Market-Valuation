variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security Group ID for ALB"
  type        = string
}

variable "target_instance_ids" {
  description = "List of Target Instance IDs"
  type        = list(string)
}

variable "internal" {
  description = "Whether the ALB is internal"
  type        = bool
  default     = false
}

variable "name_prefix" {
  description = "Prefix for the ALB name (e.g., public, internal)"
  type        = string
  default     = "alb"
}
