resource "aws_s3_bucket" "static_assets" {
  bucket_prefix = "${var.project_name}-assets-"
  force_destroy = true

  tags = {
    Name    = "${var.project_name}-assets"
    Project = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

