variable "domain_name" {
  description = "Domain name for the certificate"
  type        = string
}

variable "zone_id" {
  description = "Route 53 Zone ID for DNS validation"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
}
