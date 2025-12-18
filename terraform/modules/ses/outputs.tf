output "smtp_username" {
  value       = aws_iam_access_key.smtp_key.id
  description = "SMTP Username (Access Key ID)"
  sensitive   = true
}

output "smtp_password" {
  value       = aws_iam_access_key.smtp_key.ses_smtp_password_v4
  description = "SMTP Password (Calculated from Secret Key)"
  sensitive   = true
}

output "identity_arn" {
  value = aws_ses_domain_identity.main.arn
}
