FROM golang:1.13.4 AS builder
WORKDIR /easi/
COPY . .
RUN  CGO_ENABLED=0 GOOS=linux go build -a -o bin/easi ./cmd/easi

FROM alpine:3.12
RUN apk --no-cache add ca-certificates
WORKDIR /easi/
COPY --from=builder /easi/bin/easi .
COPY --from=builder /easi/pkg/email/templates ./templates

ARG ARG_APPLICATION_VERSION
ARG ARG_APPLICATION_DATETIME
ARG ARG_APPLICATION_TS
ENV APPLICATION_VERSION=${ARG_APPLICATION_VERSION}
ENV APPLICATION_DATETIME=${ARG_APPLICATION_DATETIME}
ENV APPLICATION_TS=${ARG_APPLICATION_TS}
ENV EMAIL_TEMPLATE_DIR=/easi/templates

COPY config/tls/rds-ca-2019-root.pem /usr/local/share/ca-certificates/rds-ca-2019-root.pem
COPY config/tls/hhs-fpki-intermediate-ca.pem /usr/local/share/ca-certificates/hhs-fpki-intermediate-ca.crt
RUN update-ca-certificates

RUN adduser -D -H easi
USER easi
