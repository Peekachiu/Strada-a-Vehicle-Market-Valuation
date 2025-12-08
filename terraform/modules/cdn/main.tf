

# --- CloudFront Distribution ---
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "ALB-${var.alb_dns_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # ALB uses HTTP
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ${var.project_name}"
  default_root_object = "index.html" # Assuming SPA/Static, or omit if pure API/Dynamic

  # Web ACL Association
  web_acl_id = var.web_acl_id

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-${var.alb_dns_name}"

    forwarded_values {
      query_string = true
      headers      = ["*"] # Forward all headers (dynamic app)
      
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0     # Disable caching by default for dynamic app
    max_ttl                = 86400
  }

  price_class = "PriceClass_100" # US, Canada, Europe (Cheaper)

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
