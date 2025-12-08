# --- IAM Role for SSM ---
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

# --- Web Servers (Launch Template & ASG) ---
resource "aws_launch_template" "web" {
  name_prefix   = "${var.project_name}-web-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.ssh_key_name

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

              # Create Dummy Web Page
              mkdir -p /home/ubuntu/html
              echo '<h1>Strada Web - Dummy Landing</h1><p>Connecting to API...</p><iframe src="/api/" width="100%" height="400px"></iframe>' > /home/ubuntu/html/index.html

              # Create Nginx Config
              cat <<EOT > /home/ubuntu/default.conf
              server {
                  listen 80;
                  location / {
                      root /usr/share/nginx/html;
                      index index.html;
                  }
                  location /api/ {
                      proxy_pass http://${var.internal_alb_dns_name}:80; 
                  }
              }
              EOT

              # Run Nginx
              docker run -d --restart=always -p 80:80 --name dummy-web \
                -v /home/ubuntu/html:/usr/share/nginx/html \
                -v /home/ubuntu/default.conf:/etc/nginx/conf.d/default.conf \
                nginx:alpine
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

# --- API Servers (Launch Template & ASG) ---
resource "aws_launch_template" "api" {
  name_prefix   = "${var.project_name}-api-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.ssh_key_name

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
              
              # Run Dummy API
              # nginxdemos/hello runs on port 80 inside container. We map host 8000 -> container 80
              docker run -d --restart=always -p 8000:80 --name dummy-api nginxdemos/hello
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
