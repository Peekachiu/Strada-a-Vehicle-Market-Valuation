output "public_alb_dns_name" {
  description = "DNS name of the Public Load Balancer"
  value       = module.public_alb.alb_dns_name
}

output "internal_alb_dns_name" {
  description = "DNS name of the Internal Load Balancer"
  value       = module.internal_alb.alb_dns_name
}

output "rds_endpoint" {
  description = "RDS Endpoint"
  value       = module.database.db_endpoint
}
