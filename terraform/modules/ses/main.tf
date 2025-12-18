# 1. Create SES Domain Identity
resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

# 2. Verify Domain Ownership (DNS Record)
resource "aws_route53_record" "ses_verification" {
  zone_id = var.zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.main.verification_token]
}

# 3. Create DKIM Tokens
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

# 4. Create DKIM DNS Records (3 CNAMEs)
resource "aws_route53_record" "ses_dkim" {
  count   = 3
  zone_id = var.zone_id
  name    = "${element(aws_ses_domain_dkim.main.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.main.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

# 5. Create SMTP IAM User
resource "aws_iam_user" "smtp_user" {
  name = "${var.project_name}-smtp-user"
}

resource "aws_iam_access_key" "smtp_key" {
  user = aws_iam_user.smtp_user.name
}

# 6. Grant Permissions to Send Email
data "aws_iam_policy_document" "ses_send" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendRawEmail"]
    resources = ["*"]
  }
}

resource "aws_iam_user_policy" "smtp_policy" {
  name   = "ses-smtp-policy"
  user   = aws_iam_user.smtp_user.name
  policy = data.aws_iam_policy_document.ses_send.json
}
