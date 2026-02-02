# Stock Module Instructions

> **For LLM:** This document describes how to design and implement a new NestJS `Stock` module for an e‑commerce inventory system. Follow NestJS conventions (modules, services, controllers, guards, DTOs). Reuse existing `SupabaseModule`, `SupabaseService`, auth guard, and `CurrentUser` decorator. Keep the design scalable: separate concerns (stock domain vs. file upload), keep DTOs clean, and avoid leaking Supabase details into controllers.

## High‑Level Goal

Build a **Stock** domain that manages products owned by authenticated users (sellers) and supplied by external suppliers. Each stock item represents a product that can be sold on marketplaces like eBay, TikTok, Amazon, etc.

- Backend: NestJS module `StockModule` using Supabase PostgreSQL for data and Supabase Storage for images.
- CRUD: Create / Read / Update / Delete stock items, scoped to the current authenticated user.
- Images: For now, support exactly **one main image** per stock item, but design the schema to easily extend to multiple images later.
- Architecture: Create a **reusable file upload module** (e.g. `FileStorageModule`) that wraps Supabase Storage. The Stock module should **depend on this module**, not talk to Storage directly.

---

## Folder & Module Structure

Follow the existing structure:

```txt
src/
├── auth/
├── profile/
├── supabase/
├── common/
├── stock/
│   ├── stock.module.ts
│   ├── stock.controller.ts
│   ├── stock.service.ts
│   ├── stock.repository.ts          # optional but recommended
│   ├── dto/
│   │   ├── create-stock.dto.ts
│   │   ├── update-stock.dto.ts
│   │   ├── list-stock.dto.ts        # query params for filtering/pagination
│   └── entities/
│       └── stock.entity.ts          # TS interface/type only (no ORM)
└── file-storage/
    ├── file-storage.module.ts
    ├── file-storage.service.ts
    └── dto/
        └── upload-file.dto.ts       # if needed for signed URLs
```

### Module Wiring

- `SupabaseModule` is already **global** and provides `SupabaseService`.
- `FileStorageModule` will import `SupabaseModule` and expose `FileStorageService`.
- `StockModule` imports `FileStorageModule` and uses `FileStorageService` inside `StockService` for image handling.
- Protect all HTTP routes with existing Supabase auth guard (e.g. `SupabaseAuthGuard`) and use the `CurrentUser` decorator to access `user.id`.

---

## Supabase Database Design (PostgreSQL)

Use Supabase Postgres for structured stock data.

### Table: `stocks`

Each row is a product/stock item for a specific user.

```sql
CREATE TABLE public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- ownership / relationships
  supplier_id UUID NULL,                 -- future: separate suppliers table

  -- core product data
  title TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  marketplace TEXT CHECK (marketplace IN ('AMAZON', 'EBAY', 'TIKTOK', 'SHOPIFY', 'OTHER')),

  -- variation label (optional)
  size_label TEXT,                       -- e.g. '38 × 70 cm'
  color_label TEXT,                      -- e.g. 'Blue, White'

  -- stock status & quantity
  stock_status TEXT NOT NULL CHECK (stock_status IN ('DRAFT', 'IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'ARCHIVED')),
  quantity INTEGER DEFAULT 0,

  -- pricing
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',  -- aligns with UI £

  -- images
  main_image_path TEXT,                  -- path/key in Supabase Storage bucket
  main_image_url TEXT,                   -- public URL cached for quick frontend use

  -- metadata
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stocks_user_id ON public.stocks(user_id);
CREATE INDEX idx_stocks_user_marketplace ON public.stocks(user_id, marketplace);
CREATE INDEX idx_stocks_user_status ON public.stocks(user_id, stock_status);
```

> **Note:** For now the UI only uses one image (`main_image_*` fields). Later, we can add a `stock_images` table with `stock_id` FK for multiple images without breaking this design.

---

## Supabase Storage Design

Create a dedicated **bucket** for stock/product images:

- Bucket name: `stock-images`
- File key pattern: `user/{userId}/stock/{stockId}/{uuid}.jpg`

Permissions:

- Bucket can be **public** for simplicity (frontend uses direct URLs), or
- Private bucket + signed URLs, if stricter access is required.

This document assumes **public bucket** with server-side uploads.

---

## FileStorageModule (Reusable Upload Layer)

The goal is to keep all Supabase Storage logic in one place.

### `FileStorageModule`

```ts
// file-storage.module.ts
import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { FileStorageService } from "./file-storage.service";

@Module({
  imports: [SupabaseModule],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
```

### `FileStorageService`

Responsibilities:

- Receive a `Buffer` (from Multer) + metadata (original filename, content type, userId, domain like `stock`).
- Generate a deterministic storage key: `user/{userId}/stock/{stockId or tempId}/{uuid.ext}`.
- Upload to Supabase Storage bucket `stock-images` using `SupabaseService.getClient()`.
- Return an object with `path` and `publicUrl`.

Pseudo‑API:

```ts
export interface UploadOptions {
  bucket: 'stock-images';
  userId: string;
  domain: 'stock';
  entityId?: string; // stock id when known
  mimeType: string;
  originalName: string;
}

export interface UploadedFileResult {
  path: string;      // storage key
  publicUrl: string; // Supabase public URL
}

uploadFile(buffer: Buffer, options: UploadOptions): Promise<UploadedFileResult>;
```

Inside `uploadFile`, use:

```ts
const client = this.supabaseService.getClient();
await client.storage.from("stock-images").upload(path, buffer, {
  contentType: options.mimeType,
  upsert: false,
});

const { data } = client.storage.from("stock-images").getPublicUrl(path);
```

> **LLM:** Implement `FileStorageService` as a thin wrapper, containing **no business logic** about stock. Stock module should not know about buckets or paths, only about URLs+paths returned by this service.

---

## Stock API Design (CRUD)

All endpoints are **protected**: require valid Supabase access token.

Base path: `/stocks`.

### 1. Create Stock

**Endpoint:** `POST /stocks`

**Auth:** Protected (use Supabase auth guard). Use current `user.id` as `user_id`.

**Body (CreateStockDto):**

```ts
{
  title: string;
  description?: string;
  sku?: string;
  marketplace?: 'AMAZON' | 'EBAY' | 'TIKTOK' | 'SHOPIFY' | 'OTHER';

  sizeLabel?: string;   // variation label
  colorLabel?: string;  // variation label

  stockStatus: 'DRAFT' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'ARCHIVED';
  quantity?: number;    // default 0

  price: number;
  currency?: string;    // default 'GBP'

  // image
  mainImageUrl?: string;   // from FileStorageModule endpoint
  mainImagePath?: string;  // optional, usually set server-side

  tags?: string[];
}
```

**Response:** Created `Stock` object.

### 2. List Stocks (with filters)

**Endpoint:** `GET /stocks`

**Query (ListStockDto):**

```ts
{
  page?: number;          // default 1
  limit?: number;         // default 20
  marketplace?: 'AMAZON' | 'EBAY' | 'TIKTOK' | 'SHOPIFY' | 'OTHER';
  stockStatus?: 'DRAFT' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'ARCHIVED';
  search?: string;        // search in title/sku
  sortBy?: 'createdAt' | 'updatedAt' | 'price';
  sortOrder?: 'asc' | 'desc';
}
```

**Response (paginated):**

```ts
{
  data: Stock[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### 3. Get Single Stock

**Endpoint:** `GET /stocks/:id`

- Ensure `stocks.user_id` matches current user.

### 4. Update Stock

**Endpoint:** `PATCH /stocks/:id`

**Body (UpdateStockDto):**

- All fields from `CreateStockDto` **optional**.
- Preserve `user_id`; never allow changing owner.
- When updating image, accept `mainImageUrl` and/or `mainImagePath` coming from FileStorage.

### 5. Delete Stock

**Endpoint:** `DELETE /stocks/:id`

- Soft delete is optional. Initial version can hard delete.
- Optional: also delete associated image from Storage using `FileStorageService`.

---

## Image Upload Flow (Single Image per Stock)

There are two good options. Pick one and stay consistent.

### Option A: Separate Upload Endpoint (Recommended)

1. Frontend calls `POST /files/stock-image` with `multipart/form-data` (`file` field) **before** creating stock.
2. `FileStorageController` uses `FileStorageService` to upload file to `stock-images` bucket.
3. Response:

   ```ts
   {
     path: string;
     publicUrl: string;
   }
   ```

4. Frontend then calls `POST /stocks` with `mainImageUrl` and `mainImagePath` from step 3.

### Option B: Combined Create + Upload

1. Frontend sends `multipart/form-data` to `POST /stocks` with stock fields + `file`.
2. `StockController` uses Multer to read file, then delegates to `FileStorageService`.
3. `StockService` uses returned `path` + `publicUrl` when inserting into `stocks` table.

> **Recommendation:** Use **Option A** for better separation and reuse (same upload endpoint can be used for other future modules).

---

## StockService Responsibilities

- Validate that the current user owns the stock row (for `GET /:id`, `PATCH /:id`, `DELETE /:id`).
- Interact with Supabase via `SupabaseService.getClient()`.
- Map DB columns (`snake_case`) to API model (`camelCase`).
- Handle pagination (limit/offset) and filters.
- Throw NestJS HTTP exceptions (`NotFoundException`, `ForbiddenException`, etc.) when needed.

Example patterns (similar to `ProfileService`):

```ts
const supabase = this.supabaseService.getClient();

const { data, error } = await supabase
  .from("stocks")
  .select("*")
  .eq("user_id", userId)
  .eq("id", stockId)
  .single();

if (error || !data) throw new NotFoundException("Stock not found");
```

Mapping helper:

```ts
private formatStock(row: any): Stock {
  return {
    id: row.id,
    userId: row.user_id,
    supplierId: row.supplier_id,
    title: row.title,
    description: row.description,
    sku: row.sku,
    marketplace: row.marketplace,
    sizeLabel: row.size_label,
    colorLabel: row.color_label,
    stockStatus: row.stock_status,
    quantity: row.quantity,
    price: Number(row.price),
    currency: row.currency,
    mainImagePath: row.main_image_path,
    mainImageUrl: row.main_image_url,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

---

## DTOs & Validation

Use `class-validator` and `class-transformer` as in other modules.

Example `CreateStockDto`:

```ts
export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsEnum(["AMAZON", "EBAY", "TIKTOK", "SHOPIFY", "OTHER"])
  marketplace?: MarketplaceType;

  @IsOptional()
  @IsString()
  sizeLabel?: string;

  @IsOptional()
  @IsString()
  colorLabel?: string;

  @IsEnum(["DRAFT", "IN_STOCK", "OUT_OF_STOCK", "DISCONTINUED", "ARCHIVED"])
  stockStatus: StockStatusType;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsUrl()
  mainImageUrl?: string;

  @IsOptional()
  @IsString()
  mainImagePath?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

> **LLM:** Keep DTOs small and focused. Do not pass `userId` from the client; always derive it from the authenticated user.

---

## Best Practices & Cross‑Cutting Concerns

1. **Auth & Ownership**
   - Reuse the existing Supabase auth guard.
   - Never trust `userId` from client; always derive from token.
   - For any `:id` route, fetch by `id` + `user_id` to avoid leaking data across users.

2. **Error Handling**
   - Use NestJS exceptions: `BadRequestException`, `NotFoundException`, `ForbiddenException`, etc.
   - Map Supabase errors to clear messages.

3. **Validation & Transformation**
   - Global `ValidationPipe` is already configured; rely on DTOs for validation.
   - Use TypeScript types/interfaces in `entities/` to keep domain model clear.

4. **Logging**
   - Optionally log errors from Supabase (but do not expose internal details to clients).

5. **Extensibility**
   - Design so that future features (multi‑image support, supplier relations, marketplace sync) only require additional tables/endpoints, not breaking changes.

---

## Skill / Instructions Files

For this project, **this single markdown file is enough** as a detailed spec for the Stock module and file upload architecture.

- If you introduce multiple large domains in the future (e.g. `Orders`, `Suppliers`, `MarketplaceSync`), you can create similar `*-module-llm-instructions.md` files per domain.
- A separate generic `skill.md` file is **not required** unless you use a framework that expects skills to be declared separately.

> **Summary for LLM:** Implement `FileStorageModule` first (with Supabase Storage integration), then implement `StockModule` using the structures, DTOs, endpoints, and DB schema defined here. Ensure all routes are protected and scoped to the current user. Do not diverge from the column/field names unless explicitly instructed.
