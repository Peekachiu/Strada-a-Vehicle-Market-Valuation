terraform {
  backend "s3" {
    bucket         = "strada-tf-state-backend"
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "strada-terraform-state-locking"
    encrypt        = true
  }
}
