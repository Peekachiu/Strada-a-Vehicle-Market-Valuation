output "web_asg_name" {
  value = aws_autoscaling_group.web.name
}

output "api_asg_name" {
  value = aws_autoscaling_group.api.name
}
