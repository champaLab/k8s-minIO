# e-Visa Partner API

Partner API for e-Visa application management, payments, and reporting.

## API Documentation

เอกสาร API มีให้บริการผ่าน **Swagger UI** และ **OpenAPI spec**

| รูปแบบ                       | URL                                  |
| ---------------------------- | ------------------------------------ |
| **Swagger UI** (interactive) | `{BASE_URL}{BASE_PATH}/api-docs`     |
| **OpenAPI JSON**             | `{BASE_URL}{BASE_PATH}/openapi.json` |

**ตัวอย่าง** (เมื่อ `BASE_PATH=/` และ server รันที่ port 8080):

- Swagger UI: http://localhost:8080/api-docs
- OpenAPI spec: http://localhost:8080/openapi.json

### การเพิ่ม API ใหม่

OpenAPI schema สร้างจาก **defineBodySchema** ในไฟล์ validate (schema เดียว → validators + OpenAPI)  
ดูรายละเอียดใน `.cursor/rules/api-documentation.mdc`

## Scripts

```bash
npm run dev          # Development (nodemon)
npm run start        # Start server
npm run build        # Build TypeScript
npm run docs:export  # Export openapi.json
npm run docs:readme  # Generate docs/API.md from OpenAPI spec
```

## Database

### TODO

- create new column in table tbl_invoice_items column name = api_charge double

### partner_api_key

```sql
create table partner_api_key
(
    id         int auto_increment
        primary key,
    partner_id int                              null,
    api_key    varchar(300)                     not null,
    expire_in  date default current_timestamp() not null,
    created_at datetime default current_timestamp() null,
    updated_at datetime                         null,
    constraint partner_api_key_pk_2
        unique (id)
);
```

<!-- create table tbl_block_intent_date -->

create table tbl_block_intent_date
(
id int auto_increment
primary key,
title varchar(255) not null,
start_date date default current_timestamp() not null,
end_date date default current_timestamp() not null,
created_date datetime default current_timestamp() null,
constraint tbl_block_intent_date_pk_2
unique (id)
);


create table tbl_partner_user
(
    id         int auto_increment
        primary key,
    username   varchar(200)                                 not null,
    password   varchar(255)                                 not null,
    status     ENUM ('INACTIVE', 'ACTIVE') default 'ACTIVE' not null,
    created_at datetime                    default NOW()    not null,
    updated_at datetime                                     null,
    constraint tbl_partner_user_pk_2
        unique (id),
    constraint tbl_partner_user_pk_3
        unique (username)
);
