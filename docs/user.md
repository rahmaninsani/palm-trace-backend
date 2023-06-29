# User API Spec

## Register User API

Endpoint:  POST /api/users

Request Body:

```json
{
  "email" : "rahman@example.com",
  "password" : "secret",
  "namaLengkap" : "Rahman Insani"
}
```

Response Body Success:

```json
{
  "data" : {
    "email" : "rahman@example.com",
    "namaLengkap" : "Rahman Insani"
  }
}
```

Response Body Error :

```json
{
  "errors" : "Email already registered"
}
```