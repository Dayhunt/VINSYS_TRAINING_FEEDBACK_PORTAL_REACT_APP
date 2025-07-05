/*

Provider configuration : apecifies AWS , Random provider
Bucket Creation : Create an S3 bucket with the Unique name 
public access : configure Public access to the bucket 
website configuration : sets up the bucket for static website hosting 
file uplods : upload the index.html and required files 
website endpoint : output the url of the static websites

*/



terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.0.0"
    }
    random = {
      source = "hashicorp/random"
      version = "3.7.2"
    }
  }
}

provider "aws" {region = "us-west-2"}


resource "random_id" "rand_id" {byte_length = 8}

resource "aws_s3_bucket" "myweb-app" {
    bucket = "myweb-app${random_id.rand_id.hex}"
  
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.myweb-app.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.myweb-app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${aws_s3_bucket.myweb-app.id}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.example]
}

resource "aws_s3_bucket_website_configuration" "webapp" {
  bucket = aws_s3_bucket.myweb-app.id

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }

#   routing_rule {
#     condition {
#       key_prefix_equals = "docs/"
#     }
#     redirect {
#       replace_key_prefix_with = "documents/"
#     }
#   }
}

# resource "aws_s3_object" "webapp-obj" {
#     bucket = aws_s3_bucket.myweb-app.bucket
#     key = "index.html"
#     source = "./index.html"
#     content_type = "text/html"
# }
# locals {
#   asset_files = fileset("./assets", "**") # List of all files in the directory recursively
# }

# resource "aws_s3_object" "webapp_assets" {
#   for_each = local.asset_files

#   bucket = aws_s3_bucket.myweb-app.bucket
#   key    = "assets/${each.value}"
#   source = "./assets/${each.value}"
#   etag   = filemd5("./assets/${each.value}")
#   content_type = lookup({
#     html = "text/html"
#     css  = "text/css"
#     js   = "application/javascript"
#     svg  = "image/svg+xml"
#     png  = "image/png"
#     jpg  = "image/jpeg"
#   }, split(".", each.value)[length(split(".", each.value)) - 1], null)
# }


# resource "aws_s3_object" "webapp-vit_img" {
#     bucket = aws_s3_bucket.myweb-app.bucket
#     key = "vite.svg"
#     source = "./vite.svg"
#     content_type = "image/svg+xml"

# }

locals {
  build_files = fileset("${path.module}/build", "**")
}

resource "aws_s3_object" "build_files" {
  for_each = local.build_files

  bucket = aws_s3_bucket.myweb-app.bucket
  key    = each.value
  source = "${path.module}/build/${each.value}"
  etag   = filemd5("${path.module}/build/${each.value}")

  content_type = lookup({
    html = "text/html"
    css  = "text/css"
    js   = "application/javascript"
    svg  = "image/svg+xml"
    png  = "image/png"
    jpg  = "image/jpeg"
    json = "application/json"
    ico  = "image/x-icon"
    map  = "application/json"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
}

 
output "name" {
    value = aws_s3_bucket_website_configuration.webapp.website_endpoint
  
}    