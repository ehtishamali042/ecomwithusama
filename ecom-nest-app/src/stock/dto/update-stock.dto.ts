import {
  IsOptional,
  IsArray,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  IsIn,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateStockDto } from "./create-stock.dto";

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(["AMAZON", "EBAY", "TIKTOK", "SHOPIFY", "OTHER"], { each: true })
  marketplace?: string[];

  @IsOptional()
  @IsUrl()
  onlineMarketplaceUrl?: string;
}
