# API Documentation

## Overview

The e-Visa Partner API is documented with **OpenAPI 3.0** and served via **Swagger UI**.

## Accessing the Docs

When the server is running:

- **Swagger UI**: `{BASE_URL}{BASE_PATH}/api-docs`
  - Example: `http://localhost:8080/api-docs` (if `BASE_PATH` is `/`)

## Adding New APIs

OpenAPI schema สร้างอัตโนมัติจาก **defineBodySchema** ในไฟล์ validate

1. สร้าง schema ใน `validate.ts`:

```typescript
const mySchema = defineBodySchema({
  field: { required: true },
})
export const myValidate = mySchema.validators
export const myOpenApi = mySchema.toOpenApi
```

2. เพิ่ม path ใน `src/swagger.ts` และใช้ `requestBody(myOpenApi)`

## Auth

- **Admin**: JWT Bearer token (RS256) in `Authorization` header
- **Partner**: `x-api-key` header with partner API key

## Tags

| Tag          | Description                             |
| ------------ | --------------------------------------- |
| Auth         | Login, tokens                           |
| Applications | Visa applications, payments, status     |
| Components   | Form components (countries, visa types) |
| Partners     | Partner CRUD, wallets                   |
| Reports      | Dashboards, reports                     |
| Utilities    | MQTT, callbacks                         |
