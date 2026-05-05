data "aws_caller_identity" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  lab_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

# ECR Repositories
resource "aws_ecr_repository" "client_repo" {
  name                 = "shopsmart-client"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "server_repo" {
  name                 = "shopsmart-server"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

# ECS Cluster
resource "aws_ecs_cluster" "shopsmart_cluster" {
  name = "shopsmart-cluster"
}

# Security Group
resource "aws_security_group" "ecs_sg" {
  name        = "shopsmart-ecs-sg"
  description = "Allow inbound traffic for ShopSmart ALB and ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description      = "Allow HTTP from anywhere"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
    description      = "Allow HTTP to client from ALB"
    from_port        = 8080
    to_port          = 8080
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
    description      = "Allow HTTP to server from ALB"
    from_port        = 5001
    to_port          = 5001
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

# Application Load Balancer
resource "aws_lb" "shopsmart_alb" {
  name               = "shopsmart-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_sg.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "client_tg" {
  name        = "shopsmart-client-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"
  health_check {
    path = "/"
    matcher = "200"
  }
}

resource "aws_lb_target_group" "server_tg" {
  name        = "shopsmart-server-tg"
  port        = 5001
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"
  health_check {
    path = "/api/health"
    matcher = "200"
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.shopsmart_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.client_tg.arn
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.front_end.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.server_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Task Definitions
resource "aws_ecs_task_definition" "client_task" {
  family                   = "shopsmart-client-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = local.lab_role_arn
  task_role_arn            = local.lab_role_arn

  container_definitions = jsonencode([{
    name      = "shopsmart-client"
    image     = "nginx:alpine"
    essential = true
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
  }])
}

resource "aws_ecs_task_definition" "server_task" {
  family                   = "shopsmart-server-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = local.lab_role_arn
  task_role_arn            = local.lab_role_arn

  container_definitions = jsonencode([{
    name      = "shopsmart-server"
    image     = "node:20-alpine"
    essential = true
    portMappings = [{
      containerPort = 5001
      hostPort      = 5001
    }]
  }])
}

# ECS Services
resource "aws_ecs_service" "client_service" {
  name            = "shopsmart-client-service"
  cluster         = aws_ecs_cluster.shopsmart_cluster.id
  task_definition = aws_ecs_task_definition.client_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.client_tg.arn
    container_name   = "shopsmart-client"
    container_port   = 8080
  }
  
  # Ignore changes to desired_count and task_definition so deployments via actions don't get reverted by terraform apply
  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

resource "aws_ecs_service" "server_service" {
  name            = "shopsmart-server-service"
  cluster         = aws_ecs_cluster.shopsmart_cluster.id
  task_definition = aws_ecs_task_definition.server_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.server_tg.arn
    container_name   = "shopsmart-server"
    container_port   = 5001
  }

  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

output "alb_dns_name" {
  value       = aws_lb.shopsmart_alb.dns_name
  description = "The DNS name of the ALB"
}
