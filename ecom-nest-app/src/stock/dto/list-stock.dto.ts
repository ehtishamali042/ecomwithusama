import {
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsArray,
  IsUrl,
  ValidateIf,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { MarketplaceType, StockStatusType } from "../entities/stock.entity";

export class ListStockDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.length > 0) return [value];
    return undefined;
  })
  marketplace?: string[];

  @IsOptional()
  @IsUrl()
  onlineMarketplaceUrl?: string;

  @IsOptional()
  @IsEnum(["DRAFT", "IN_STOCK", "OUT_OF_STOCK", "DISCONTINUED", "ARCHIVED"])
  stockStatus?: StockStatusType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(["createdAt", "updatedAt", "price"])
  sortBy?: "createdAt" | "updatedAt" | "price" = "createdAt";

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
