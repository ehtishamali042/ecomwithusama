import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsIn,
  IsEnum,
} from "class-validator";
import { MarketplaceType, StockStatusType } from "../entities/stock.entity";

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
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(["AMAZON", "EBAY", "TIKTOK", "SHOPIFY", "OTHER"], { each: true })
  marketplace?: string[];

  @IsOptional()
  @IsUrl()
  onlineMarketplaceUrl?: string;

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
