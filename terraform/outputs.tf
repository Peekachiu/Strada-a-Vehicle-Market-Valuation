output "alb_dns_name" {
  value = module.public_alb.alb_dns_name
}

output "rds_endpoint" {
  value = module.database.db_endpoint
}

output "nameservers" {
  value = module.route53.name_servers
}
