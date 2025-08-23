import Image from "next/image";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProductListings() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {/* Product 1 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Image
                src="/dumpster.png"
                alt="Container"
                width={80}
                height={60}
                className="object-contain"
              />
              <div>
                <h3 className="font-semibold text-gray-900">17 Yard Dumpster</h3>
                <p className="text-gray-600 text-sm">Dimensions: 16&apos; long x 8&apos; wide x 4&apos; high</p>
                <p className="text-gray-600 text-sm">Best for: Home cleanouts, small renovation projects</p>
                <p className="text-gray-600 text-sm font-medium">Includes 2 tons of disposal</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-main">{formatCurrency(595)}</div>
              <p className="text-xs text-gray-500 mt-1">+ {formatCurrency(125)} per additional ton</p>
              <button className="mt-2 bg-main text-white px-4 py-2 rounded font-semibold text-sm hover:opacity-90 transition">
                Rent Now
              </button>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Image
                src="/dumpster.png"
                alt="Container"
                width={80}
                height={60}
                className="object-contain"
              />
              <div>
                <h3 className="font-semibold text-gray-900">21 Yard Dumpster</h3>
                <p className="text-gray-600 text-sm">Dimensions: 20&apos; long x 8&apos; wide x 4.5&apos; high</p>
                <p className="text-gray-600 text-sm">Best for: Medium renovation projects, roof repairs</p>
                <p className="text-gray-600 text-sm font-medium">Includes 2 tons of disposal</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-main">{formatCurrency(695)}</div>
              <p className="text-xs text-gray-500 mt-1">+ {formatCurrency(125)} per additional ton</p>
              <button className="mt-2 bg-main text-white px-4 py-2 rounded font-semibold text-sm hover:opacity-90 transition">
                Rent Now
              </button>
            </div>
          </div>

          {/* Additional Charges Section */}
          <div className="bg-gray-50 rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Charges</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Extra Tonnage:</span>
                <span className="font-medium">{formatCurrency(125)} per ton</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appliances:</span>
                <span className="font-medium">{formatCurrency(30)} each</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extra Days:</span>
                <span className="font-medium">{formatCurrency(30)} per day</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Concrete & dirt dumpsters available - please call to order these specialized containers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
