import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { StockService } from "./stock.service";
import { CreateStockDto, UpdateStockDto, ListStockDto } from "./dto";
import { SupabaseAuthGuard } from "../auth/guards/supabase-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { SupabaseUser } from "../types/supabase-user";

@Controller("stocks")
@UseGuards(SupabaseAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Create a new stock item
   * POST /stocks
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: SupabaseUser,
    @Body() createStockDto: CreateStockDto,
  ) {
    return this.stockService.create(user.id, createStockDto);
  }

  /**
   * Get paginated list of stocks with filters
   * GET /stocks?page=1&limit=20&marketplace=AMAZON&stockStatus=IN_STOCK
   */
  @Get()
  async findAll(
    @CurrentUser() user: SupabaseUser,
    @Query() listStockDto: ListStockDto,
  ) {
    console.log("ListStockDtos:", listStockDto, user.id);
    return this.stockService.findAll(user.id, listStockDto);
  }

  /**
   * Get a single stock item by ID
   * GET /stocks/:id
   */
  @Get(":id")
  async findOne(
    @CurrentUser() user: SupabaseUser,
    @Param("id") stockId: string,
  ) {
    return this.stockService.findOne(user.id, stockId);
  }

  /**
   * Update a stock item
   * PATCH /stocks/:id
   */
  @Patch(":id")
  async update(
    @CurrentUser() user: SupabaseUser,
    @Param("id") stockId: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(user.id, stockId, updateStockDto);
  }

  /**
   * Delete a stock item
   * DELETE /stocks/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: SupabaseUser,
    @Param("id") stockId: string,
  ) {
    await this.stockService.remove(user.id, stockId);
  }
}
