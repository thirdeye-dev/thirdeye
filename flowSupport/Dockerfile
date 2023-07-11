# Set the base image
FROM golang:1.19

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source code to the container
COPY flowSupport/ ./

ENV GO111MODULE="on" \
  CGO_ENABLED="0" \
  GO_GC="off"

# Download dependencies
RUN go mod download

RUN go mod tidy

RUN go clean -modcache

# Build the Go binary
RUN go build -o main .

# Set the entrypoint command to run the Go binary
ENTRYPOINT  ["go", "run", "main.go"]
