output "alb_dns_name" {
  value = module.public_alb.alb_dns_name
}

output "rds_endpoint" {
  value = module.database.db_endpoint
}

output "nameservers" {
  value = module.route53.name_servers
}

output "s3_bucket_name" {
  value = module.storage.bucket_name
}

output "api_asg_name" {
  value = module.compute.api_asg_name
}

output "ses_smtp_username" {
  value       = module.ses.smtp_username
  description = "SMTP Username for Django settings"
  sensitive   = true
}

output "ses_smtp_password" {
  value       = module.ses.smtp_password
  description = "SMTP Password for Django settings"
  sensitive   = true
}
