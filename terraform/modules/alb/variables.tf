variable "project_name" {
  description = "Project name"
  type        = string
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
