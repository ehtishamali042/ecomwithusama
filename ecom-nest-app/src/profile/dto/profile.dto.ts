import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Min,
  Max,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultProfitMarginPercent?: number;

  @IsOptional()
  @IsString()
  @IsIn(["AMAZON", "EBAY"])
  preferredMarketplace?: "AMAZON" | "EBAY";
}
