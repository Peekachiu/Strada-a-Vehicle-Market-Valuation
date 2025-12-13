output "nameservers" {
  value = module.route53.name_servers
}

output "alb_dns_name" {
  value = module.public_alb.alb_dns_name
}
