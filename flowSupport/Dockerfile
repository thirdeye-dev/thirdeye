# Set the base image
FROM golang:1.16

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source code to the container
COPY . .

# Build the Go binary
RUN go build -o main .

# Set the entrypoint command to run the Go binary
CMD ["./main"]
