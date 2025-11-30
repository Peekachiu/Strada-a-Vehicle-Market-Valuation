output "web_instance_ids" {
  description = "IDs of the Web Server instances"
  value       = aws_instance.web[*].id
}

output "api_instance_ids" {
  description = "IDs of the API Server instances"
  value       = aws_instance.api[*].id
}
