import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { FileStorageService } from "../file-storage/file-storage.service";
import { CreateStockDto, UpdateStockDto, ListStockDto } from "./dto";
import { Stock } from "./entities/stock.entity";

export interface PaginatedStockResponse {
  data: Stock[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class StockService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Create a new stock item for the authenticated user
   */
  async create(userId: string, createStockDto: CreateStockDto): Promise<Stock> {
    try {
      const supabase = this.supabaseService.getClient();

      // Prepare data for insertion
      const stockData = {
        user_id: userId,
        title: createStockDto.title,
        description: createStockDto.description || null,
        sku: createStockDto.sku || null,
        marketplace: createStockDto.marketplace || null,
        online_marketplace_url: createStockDto.onlineMarketplaceUrl || null,
        size_label: createStockDto.sizeLabel || null,
        color_label: createStockDto.colorLabel || null,
        stock_status: createStockDto.stockStatus,
        quantity: createStockDto.quantity ?? 0,
        price: createStockDto.price,
        currency: createStockDto.currency || "GBP",
        main_image_path: createStockDto.mainImagePath || null,
        main_image_url: createStockDto.mainImageUrl || null,
        tags: createStockDto.tags || [],
      };

      const { data, error } = await supabase
        .from("stocks")
        .insert(stockData)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to create stock: ${error.message}`,
        );
      }

      if (!data) {
        throw new InternalServerErrorException("Failed to create stock");
      }

      return this.formatStock(data);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while creating stock",
      );
    }
  }

  /**
   * Get paginated list of stocks for the authenticated user
   */
  async findAll(
    userId: string,
    listStockDto: ListStockDto,
  ): Promise<PaginatedStockResponse> {
    try {
      const supabase = this.supabaseService.getClient();
      const page = listStockDto.page || 1;
      const limit = listStockDto.limit || 20;
      const offset = (page - 1) * limit;

      // Build query
      let query = supabase
        .from("stocks")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      // Apply filters
      if (listStockDto.marketplace && Array.isArray(listStockDto.marketplace)) {
        // Use overlaps for array columns
        query = query.overlaps("marketplace", listStockDto.marketplace);
      } else if (listStockDto.marketplace) {
        // Single value, wrap as array for overlaps
        query = query.overlaps("marketplace", [listStockDto.marketplace]);
      }

      if (listStockDto.stockStatus) {
        query = query.eq("stock_status", listStockDto.stockStatus);
      }

      if (listStockDto.search) {
        query = query.or(
          `title.ilike.%${listStockDto.search}%,sku.ilike.%${listStockDto.search}%`,
        );
      }

      // Apply sorting
      const sortBy = listStockDto.sortBy || "createdAt";
      const sortOrder = listStockDto.sortOrder || "desc";
      const sortColumn = this.getSortColumn(sortBy);
      query = query.order(sortColumn, { ascending: sortOrder === "asc" });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch stocks: ${error.message}`,
        );
      }

      const stocks = (data || []).map((row) => this.formatStock(row));
      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: stocks,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching stocks",
      );
    }
  }

  /**
   * Get a single stock item by ID (user must own it)
   */
  async findOne(userId: string, stockId: string): Promise<Stock> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("id", stockId)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        throw new NotFoundException("Stock not found");
      }

      return this.formatStock(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching stock",
      );
    }
  }

  /**
   * Update a stock item (user must own it)
   */
  async update(
    userId: string,
    stockId: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    try {
      // First verify ownership
      await this.findOne(userId, stockId);

      const supabase = this.supabaseService.getClient();

      // Prepare update data (only include provided fields)
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updateStockDto.title !== undefined) {
        updateData.title = updateStockDto.title;
      }
      if (updateStockDto.description !== undefined) {
        updateData.description = updateStockDto.description;
      }
      if (updateStockDto.sku !== undefined) {
        updateData.sku = updateStockDto.sku;
      }
      if (updateStockDto.marketplace !== undefined) {
        updateData.marketplace = updateStockDto.marketplace;
      }
      if (updateStockDto.sizeLabel !== undefined) {
        updateData.size_label = updateStockDto.sizeLabel;
      }
      if (updateStockDto.colorLabel !== undefined) {
        updateData.color_label = updateStockDto.colorLabel;
      }
      if (updateStockDto.stockStatus !== undefined) {
        updateData.stock_status = updateStockDto.stockStatus;
      }
      if (updateStockDto.quantity !== undefined) {
        updateData.quantity = updateStockDto.quantity;
      }
      if (updateStockDto.price !== undefined) {
        updateData.price = updateStockDto.price;
      }
      if (updateStockDto.currency !== undefined) {
        updateData.currency = updateStockDto.currency;
      }
      if (updateStockDto.mainImagePath !== undefined) {
        updateData.main_image_path = updateStockDto.mainImagePath;
      }
      if (updateStockDto.mainImageUrl !== undefined) {
        updateData.main_image_url = updateStockDto.mainImageUrl;
      }
      if (updateStockDto.tags !== undefined) {
        updateData.tags = updateStockDto.tags;
      }

      const { data, error } = await supabase
        .from("stocks")
        .update(updateData)
        .eq("id", stockId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to update stock: ${error.message}`,
        );
      }

      if (!data) {
        throw new InternalServerErrorException("Failed to update stock");
      }

      return this.formatStock(data);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while updating stock",
      );
    }
  }

  /**
   * Delete a stock item (user must own it)
   */
  async remove(userId: string, stockId: string): Promise<void> {
    try {
      // First verify ownership and get stock data
      const stock = await this.findOne(userId, stockId);

      const supabase = this.supabaseService.getClient();

      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", stockId)
        .eq("user_id", userId);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to delete stock: ${error.message}`,
        );
      }

      // Optionally delete associated image from storage
      if (stock.mainImagePath) {
        try {
          await this.fileStorageService.deleteFile(
            "stock-images",
            stock.mainImagePath,
          );
        } catch (error) {
          // Log error but don't fail the delete operation
          console.error("Failed to delete stock image:", error);
        }
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while deleting stock",
      );
    }
  }

  /**
   * Format database row to Stock entity (snake_case to camelCase)
   */
  private formatStock(row: any): Stock {
    return {
      id: row.id,
      userId: row.user_id,
      supplierId: row.supplier_id,
      title: row.title,
      description: row.description,
      sku: row.sku,
      marketplace: row.marketplace,
      onlineMarketplaceUrl: row.online_marketplace_url,
      sizeLabel: row.size_label,
      colorLabel: row.color_label,
      stockStatus: row.stock_status,
      quantity: row.quantity,
      price: Number(row.price),
      currency: row.currency,
      mainImagePath: row.main_image_path,
      mainImageUrl: row.main_image_url,
      tags: row.tags || [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Map API sort field to database column
   */
  private getSortColumn(sortBy: string): string {
    const columnMap: Record<string, string> = {
      createdAt: "created_at",
      updatedAt: "updated_at",
      price: "price",
    };
    return columnMap[sortBy] || "created_at";
  }
}
