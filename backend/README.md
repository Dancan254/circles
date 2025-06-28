## Circles CCIP Address Transaction Backend

**Example Response:**

```json
[
  {
    "messageId": "...",
    "state": 2,
    "transactionHash": "...",
    ...
  }
]
```

## Getting Started

### Prerequisites

- [Go](https://golang.org/) 1.18 or higher

### Installation & Running

1. Clone the repository or copy the backend code.
2. Navigate to the backend directory.
3. Run the server:

```sh
go run src/main.go
```

The server will start on `http://localhost:8080`.

## Usage

Point your frontend or API client to:

```

## Notes

- This backend is intended for development and prototyping. For production, consider adding rate limiting, error handling, and environment variable support.
- The backend simply proxies data from Chainlink and does not store or modify it.

## License

MIT
```
