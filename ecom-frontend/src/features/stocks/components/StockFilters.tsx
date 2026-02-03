// No default React import required with the new JSX transform

type Props = {
  search?: string;
  marketplace?: string;
  stockStatus?: string;
  onChange: (next: {
    search?: string;
    marketplace?: string;
    stockStatus?: string;
  }) => void;
};

export default function StockFilters({
  search = "",
  marketplace = "",
  stockStatus = "",
  onChange,
}: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        className="input input-bordered w-full"
        placeholder="Search stocks..."
        value={search}
        onChange={(e) => onChange({ search: e.target.value })}
      />
      <select
        className="select select-bordered"
        value={marketplace}
        onChange={(e) => onChange({ marketplace: e.target.value })}
      >
        <option value="">All marketplaces</option>
        <option value="AMAZON">Amazon</option>
        <option value="EBAY">eBay</option>
        <option value="TIKTOK">TikTok</option>
        <option value="SHOPIFY">Shopify</option>
        <option value="OTHER">Other</option>
      </select>
      <select
        className="select select-bordered"
        value={stockStatus}
        onChange={(e) => onChange({ stockStatus: e.target.value })}
      >
        <option value="">All statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="IN_STOCK">In stock</option>
        <option value="OUT_OF_STOCK">Out of stock</option>
        <option value="DISCONTINUED">Discontinued</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>
  );
}
