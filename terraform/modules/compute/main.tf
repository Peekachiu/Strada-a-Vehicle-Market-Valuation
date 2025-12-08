#####################################################################
# IAM Role for SSM
#####################################################################
resource "aws_iam_role" "ssm_role" {
  name = "${var.project_name}-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ssm_profile" {
  name = "${var.project_name}-ssm-profile"
  role = aws_iam_role.ssm_role.name
}

#####################################################################
# Web Servers (Launch Template & ASG)
#####################################################################
resource "aws_launch_template" "web" {
  name_prefix   = "${var.project_name}-web-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type


  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [var.web_sg_id]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ssm_profile.name
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-web"
      Role = "web"
    }
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu

              # Login to Docker Hub (Public, so no login needed usually, but good practice if private later)
              # docker login -u ... -p ...

              # Run Frontend Container
              # The Nginx image is configured to substitute API_HOST in default.conf.template
              docker run -d --restart=always -p 80:80 \
                -e API_HOST=${var.internal_alb_dns_name} \
                peekachiu/strada-frontend:latest
              EOF
  )
}

resource "aws_autoscaling_group" "web" {
  name                = "${var.project_name}-web-asg"
  vpc_zone_identifier = var.public_subnet_ids
  target_group_arns   = [var.public_target_group_arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  desired_capacity = 2
  min_size         = 1
  max_size         = 2

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-web-asg"
    propagate_at_launch = true
  }
}

#####################################################################
# API Servers (Launch Template & ASG)
#####################################################################
resource "aws_launch_template" "api" {
  name_prefix   = "${var.project_name}-api-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type


  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [var.api_sg_id]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ssm_profile.name
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-api"
      Role = "api"
    }
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              
              # Run Backend Container
              # Passing DB credentials via Environment Variables
              docker run -d --restart=always -p 8000:8000 \
                -e DB_HOST=${var.db_host} \
                -e DB_PORT=${var.db_port} \
                -e DB_NAME=${var.db_name} \
                -e DB_USER=${var.db_username} \
                -e DB_PASSWORD=${var.db_password} \
                -e ALLOWED_HOSTS='*' \
                peekachiu/strada-backend:latest
              EOF
  )
}

resource "aws_autoscaling_group" "api" {
  name                = "${var.project_name}-api-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [var.internal_target_group_arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  desired_capacity = 2
  min_size         = 1
  max_size         = 2

  launch_template {
    id      = aws_launch_template.api.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-api-asg"
    propagate_at_launch = true
  }
}
