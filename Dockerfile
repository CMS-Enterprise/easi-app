FROM golang:1.13.4 AS builder
WORKDIR /easi/
COPY . .

RUN  CGO_ENABLED=0 GOOS=linux go build -a -o bin/easi ./cmd/easi

FROM alpine:3
RUN apk --no-cache add ca-certificates
WORKDIR /easi/
COPY --from=builder /easi/bin/easi .

COPY config/tls/hhs-fpki-intermediate-ca.pem /usr/local/share/ca-certificates/hhs-fpki-intermediate-ca.crt
RUN update-ca-certificates

RUN adduser -D -H easi
USER easi
