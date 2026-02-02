# Backend Instructions

> **For LLM:** Build phase by phase. Start with Phase 1 (Auth) completely before moving to Phase 2. Follow NestJS conventions (modules, services, controllers, guards). Ask clarifying questions if business rules are unclear.

## Overview

E-commerce inventory management app for Amazon/eBay sellers. Backend acts as single gateway - frontend only talks to NestJS, which proxies to Supabase (auth) and MongoDB (inventory).

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Auth:** Supabase (free tier) - backend proxies auth requests
- **Structured Data:** Supabase PostgreSQL (profiles, settings)
- **Flexible Data:** MongoDB (inventory from Excel imports)
- **Validation:** class-validator

## Architecture

```
Frontend (React) → NestJS Backend → Supabase (Auth + PostgreSQL)
                        ↓
                    MongoDB (Inventory)
```

---

## Phase 1: Authentication (Priority)

### Auth Endpoints (proxy to Supabase)

| Endpoint              | Description                           |
| --------------------- | ------------------------------------- |
| `POST /auth/register` | Register user                         |
| `POST /auth/login`    | Login, return access + refresh tokens |
| `POST /auth/refresh`  | Refresh access token                  |
| `POST /auth/logout`   | Logout (protected)                    |
| `GET /auth/me`        | Get current user (protected)          |

### Request/Response DTOs

```typescript
// Register & Login Request
{ email: string, password: string (min 8 chars) }

// Auth Success Response
{
  user: { id, email, firstName?, lastName? },
  session: { accessToken, refreshToken, expiresAt }
}

// Refresh Request
{ refreshToken: string }

// Profile Update Request
{ firstName?: string, lastName?: string }

// Settings Update Request
{ defaultProfitMarginPercent?: number, preferredMarketplace?: 'AMAZON' | 'EBAY' }
```

### Profile Endpoints (protected)

- `GET /profile` - Get profile
- `PATCH /profile` - Update profile
- `GET /profile/settings` - Get settings
- `PATCH /profile/settings` - Update settings

### Supabase Tables (PostgreSQL)

```sql
-- profiles (auto-created via trigger on auth.users insert)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  default_profit_margin_percent DECIMAL(5,2),
  preferred_marketplace TEXT CHECK (preferred_marketplace IN ('AMAZON', 'EBAY')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Auth Flow

1. Frontend calls `POST /auth/login` with email/password
2. Backend calls Supabase `signInWithPassword`
3. Backend returns `{ user, session: { accessToken, refreshToken, expiresAt } }`
4. Frontend stores tokens, sends `Authorization: Bearer <accessToken>` on requests
5. Backend validates token via `supabase.auth.getUser(token)`

### Folder Structure

```
src/
├── auth/           # AuthModule, AuthService, AuthController, SupabaseAuthGuard
├── profile/        # ProfileModule, ProfileService, ProfileController
├── supabase/       # SupabaseModule, SupabaseService
├── common/         # CurrentUser decorator, filters
└── main.ts
```

### Environment Variables

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=xxx
MONGODB_URI=mongodb://localhost:27017/ecomapp
PORT=3000
FRONTEND_URL=http://localhost:3001
```

---

## Phase 2: Inventory & Excel Import

### Endpoints (all protected)

- `POST /inventory/import` - Upload Excel file (multipart/form-data, field: `file`, query: `source=AMAZON|EBAY`)
- `GET /inventory` - List items with pagination and filters
- `GET /inventory/:id` - Single item
- `GET /inventory/stats` - Aggregated metrics
- `GET /imports` - List import batches
- `GET /imports/:id` - Import batch details

### Query Parameters for GET /inventory

```
?page=1&limit=20&marketplace=AMAZON&search=keyword&sortBy=createdAt&sortOrder=desc
```

### Paginated Response Format

```typescript
{
  data: InventoryItem[],
  meta: { total, page, limit, totalPages }
}
```

### Stats Response (GET /inventory/stats)

```typescript
{
  totalItems: number,
  totalQuantity: number,
  byMarketplace: { AMAZON: { count, quantity }, EBAY: { count, quantity } },
  totalValue: number  // sum of quantity * listingPrice
}
```

### MongoDB Schemas

```typescript
// InventoryItem - flexible schema for varying Excel formats
{
  userId: string,        // Supabase UUID
  sku: string,
  title: string,
  marketplace: 'AMAZON' | 'EBAY',
  listingId: string,     // ASIN or eBay Item ID
  quantity: number,
  costPrice: number,
  listingPrice: number,
  fees: number,
  rawData: object,       // Original Excel row
  importBatchId: string,
  createdAt, updatedAt
}

// ImportBatch - track import history
{
  userId: string,
  source: 'AMAZON' | 'EBAY',
  fileName: string,
  recordCount: number,
  successCount: number,
  errorCount: number,
  errors: [{ row, message }],
  createdAt
}

// Indexes
InventoryItem: { userId: 1 }, { userId: 1, marketplace: 1, listingId: 1 } (unique)
ImportBatch: { userId: 1 }
```

### Excel Import Logic

1. Accept multipart file upload
2. Parse with `xlsx` library
3. Map columns to InventoryItem fields
4. Upsert based on `userId + marketplace + listingId`
5. Store raw row in `rawData` for flexibility
6. Create ImportBatch record with stats

---

## Phase 3: Pricing Calculator

### Endpoint

`POST /pricing/calculate` (protected)

### Input

```typescript
{
  costPrice: number,
  desiredMarginPercent: number,
  marketplace: 'AMAZON' | 'EBAY',
  fees?: number  // optional, use defaults if not provided
}
```

### Output

```typescript
{
  recommendedPrice: number,
  profit: number,
  marginPercent: number,
  breakdown: { cost, fees, net }
}
```

### Default Fee Estimates

- Amazon: ~15% of sale price
- eBay: ~13% of sale price

---

## Key Implementation Notes

1. **SupabaseModule** - Make it global so SupabaseService is available everywhere:

   ```typescript
   @Global()
   @Module({ providers: [SupabaseService], exports: [SupabaseService] })
   ```

2. **Auth Guard** - Validates JWT via `supabase.auth.getUser(token)`, attaches user to `request.user`

3. **CurrentUser Decorator** - Extract user from request: `createParamDecorator(() => request.user)`

4. **Error Responses** - Use NestJS exceptions, consistent format:

   ```typescript
   { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' }
   ```

5. **Global Validation** - Enable in main.ts:

   ```typescript
   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
   ```

6. **CORS** - Enable for frontend URL:

   ```typescript
   app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
   ```

7. **Token Expiration** - Access tokens expire (1hr default). Frontend should:
   - Catch 401 errors
   - Call `POST /auth/refresh` with refreshToken
   - Retry original request with new accessToken

---

## Dependencies

```bash
# Core
npm install @nestjs/config class-validator class-transformer

# Supabase
npm install @supabase/supabase-js

# MongoDB (Phase 2)
npm install @nestjs/mongoose mongoose

# Excel (Phase 2)
npm install xlsx

# File upload (Phase 2)
npm install @nestjs/platform-express multer
```
