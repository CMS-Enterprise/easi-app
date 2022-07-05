# Add SSL Certificates

## How to update a certificate

There are a few SSL certificates that we import for our server to use. These certificates are located in the [config/tls](../../config/tls) directory.

In order to trust a new certificate, take the following steps:

1. Place a copy of the certificate in the [config/tls](../../config/tls) directory.
2. Edit the [Dockerfile](../../Dockerfile) to contain a line that copies the certificate from this directory into the `/usr/local/share/ca-certificates/` directory.
   - **NOTE:** The file should always be copied so that it has the `.crt` extension. The `update-ca-certificates` utility that is used will only look for files with this extension in this directory.

```docker
COPY config/tls/HHS-FPKI-Intermediate-CA-E1.cer /usr/local/share/ca-certificates/HHS-FPKI-Intermediate-CA-E1.crt
```

## How to test if a certificate is imported

It's nice to validate that the certificate is actually in the docker container when it's running. In order to do this:

1. Start the backend
    ```bash
    scripts/dev up:backend
    ```
2. Shell into the backend so you can explore the file structure & run commands
    ```bash
    docker-compose exec -it easi /bin/bash
    ```
3. Scan for expected certificates using `openssl`. It's often useful to `grep` this output for the serial of the certificate. The following command should output useful information for the certificate given a serial:
    ```bash
    awk -v cmd='openssl x509 -noout -subject -serial -startdate -enddate' '/BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-certificates.crt | grep -i 'your serial number here' -B1 -A2
    ```
