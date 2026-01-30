import { useState, useMemo } from "react";

const ProfitCalculator = () => {
  const [config, setConfig] = useState({
    platform: "ebay",
    region: "US",
    category: "most",
  });

  const [saleDetails, setSaleDetails] = useState({
    itemPrice: 50,
    shippingCharged: 0,
    quantitySold: 1,
  });

  const [unitCosts, setUnitCosts] = useState({
    itemCost: 15,
    shippingCost: 5,
    otherCost: 0,
  });

  const platformFees = useMemo(
    () =>
      ({
        ebay: { finalValueFee: 0.136, perOrderFee: 0.3 },
        amazon: { finalValueFee: 0.15, perOrderFee: 0 },
        tiktok: { finalValueFee: 0.08, perOrderFee: 0 },
      }) as const,
    [],
  );

  type PlatformKey = keyof typeof platformFees;

  const calculations = useMemo(() => {
    const platformKey = config.platform as PlatformKey;
    const revenue =
      (saleDetails.itemPrice + saleDetails.shippingCharged) *
      saleDetails.quantitySold;
    const totalCosts =
      (unitCosts.itemCost + unitCosts.shippingCost + unitCosts.otherCost) *
      saleDetails.quantitySold;
    const fees = platformFees[platformKey];
    const finalValueFee = revenue * fees.finalValueFee;
    const perOrderFee = fees.perOrderFee * saleDetails.quantitySold;
    const platformFeesTotal = finalValueFee + perOrderFee;
    const netProfit = revenue - totalCosts - platformFeesTotal;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
    return {
      revenue,
      totalCosts,
      platformFees: platformFeesTotal,
      netProfit,
      margin,
      roi,
    };
  }, [config, saleDetails, unitCosts, platformFees]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profit & Loss Calculator
          </h1>
          <p className="mt-2 text-gray-600">
            Analyze your e-commerce profitability across multiple platforms
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Configuration & Inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Platform Configuration */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Configuration
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={config.platform}
                      onChange={(e) =>
                        setConfig({ ...config, platform: e.target.value })
                      }
                    >
                      <option value="ebay">eBay</option>
                      <option value="amazon">Amazon</option>
                      <option value="tiktok">TikTok</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={config.region}
                      onChange={(e) =>
                        setConfig({ ...config, region: e.target.value })
                      }
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={config.category}
                      onChange={(e) =>
                        setConfig({ ...config, category: e.target.value })
                      }
                    >
                      <option value="most">Most Categories</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home & Garden</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Inputs */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Revenue
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={saleDetails.itemPrice}
                        onChange={(e) =>
                          setSaleDetails({
                            ...saleDetails,
                            itemPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={saleDetails.shippingCharged}
                        onChange={(e) =>
                          setSaleDetails({
                            ...saleDetails,
                            shippingCharged: parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={saleDetails.quantitySold}
                      onChange={(e) =>
                        setSaleDetails({
                          ...saleDetails,
                          quantitySold: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Inputs */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Costs
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={unitCosts.itemCost}
                        onChange={(e) =>
                          setUnitCosts({
                            ...unitCosts,
                            itemCost: parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={unitCosts.shippingCost}
                        onChange={(e) =>
                          setUnitCosts({
                            ...unitCosts,
                            shippingCost: parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Costs
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={unitCosts.otherCost}
                        onChange={(e) =>
                          setUnitCosts({
                            ...unitCosts,
                            otherCost: parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary Table */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Financial Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${calculations.revenue}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Total Costs
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${calculations.totalCosts}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Platform Fees
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${calculations.platformFees}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-base font-semibold text-gray-900">
                      Net Profit
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ${calculations.netProfit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-1 space-y-6">
            {/* Net Profit Card */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-600">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Net Profit
                </h3>
              </div>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  ${calculations.netProfit}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Margin</span>
                    <span className="font-semibold text-gray-900">
                      {calculations.margin}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold text-gray-900">
                      {calculations.roi}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Breakdown
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Revenue
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    ${calculations.revenue}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Costs
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    ${calculations.totalCosts}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Fees
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    ${calculations.platformFees}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium border border-blue-600 transition-colors">
                Export Report
              </button>
              <button className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium border border-gray-300 transition-colors">
                Reset Values
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;
