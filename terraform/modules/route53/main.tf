terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.0.0"
      configuration_aliases = [aws.domains]
    }
  }
}

resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = {
    Name    = var.domain_name
    Project = var.project_name
  }
}


resource "aws_route53domains_registered_domain" "main" {
  provider    = aws.domains
  domain_name = var.domain_name

  dynamic "name_server" {
    for_each = aws_route53_zone.main.name_servers
    content {
      name = name_server.value
    }
  }

  tags = {
    Name    = var.domain_name
    Project = var.project_name
  }
}
