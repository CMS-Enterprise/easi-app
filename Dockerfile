FROM golang:1.22.7 AS base

WORKDIR /easi/

COPY config/tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

COPY go.mod go.sum ./
RUN go mod download

FROM base AS dev

RUN go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install golang.org/x/tools/gopls@latest && \
    go install github.com/cosmtrek/air@4612c12f1ed7c899314b8430bc1d841ca2cb061a

FROM base AS build

COPY cmd/ ./cmd/
COPY pkg/ ./pkg/
RUN CGO_ENABLED=0 GOOS=linux go build -a -o bin/easi ./cmd/easi

FROM gcr.io/distroless/base:latest

WORKDIR /easi/

COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /easi/pkg/email/templates ./templates
COPY --from=build /easi/bin/easi ./

ARG ARG_APPLICATION_VERSION
ARG ARG_APPLICATION_DATETIME
ARG ARG_APPLICATION_TS
ENV APPLICATION_VERSION=${ARG_APPLICATION_VERSION} \
    APPLICATION_DATETIME=${ARG_APPLICATION_DATETIME} \
    APPLICATION_TS=${ARG_APPLICATION_TS} \
    EMAIL_TEMPLATE_DIR=/easi/templates

USER 1000

ENTRYPOINT ["/easi/easi"]

CMD ["serve"]
