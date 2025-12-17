#####################################################################
# Cloudfront (CDN)
#####################################################################
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

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

  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_id                = "S3-${var.s3_bucket_domain_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ${var.project_name}"
  default_root_object = "index.html" # Assuming SPA/Static, or omit if pure API/Dynamic

  # Web ACL Association
  web_acl_id = var.web_acl_id

  ordered_cache_behavior {
    path_pattern     = "/images/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_domain_name}"

    forwarded_values {
      query_string = false
      headers      = []
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

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
    default_ttl            = 0 # Disable caching by default for dynamic app
    max_ttl                = 86400
  }

  price_class = "PriceClass_100" # US, Canada, Europe (Cheaper)

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = var.aliases

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
