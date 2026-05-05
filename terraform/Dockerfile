# Stage 1: Base image
FROM hashicorp/terraform:1.5.0 AS base

# Stage 2: Production image with non-root user and healthcheck
FROM alpine:3.18
COPY --from=base /bin/terraform /bin/terraform

# Create non-root user
RUN addgroup -S terraform && adduser -S terraform -G terraform

# Switch to non-root user
USER terraform

WORKDIR /app

# Simple healthcheck for CLI tool
HEALTHCHECK --interval=30s --timeout=3s \
  CMD terraform version || exit 1

ENTRYPOINT ["/bin/terraform"]
