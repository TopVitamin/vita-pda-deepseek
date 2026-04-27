import { memo } from 'react';

export interface ProductCardProduct {
  productCode: string;
  productName: string;
  barcode: string;
  spec?: string;
  unit?: string;
}

export interface ProductCardProps {
  product: ProductCardProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const { productCode, productName, barcode, spec, unit } = product;

  return (
    <div
      className="bg-white rounded-lg border border-[#e5e7eb]"
      style={{ padding: 10 }}
    >
      {/* 商品名称 */}
      <div
        className="font-medium text-gray-900 truncate"
        style={{ fontSize: 15, lineHeight: '22px' }}
      >
        {productName}
      </div>

      {/* 编码和条码 */}
      <div className="flex flex-col mt-1 gap-0.5" style={{ fontSize: 12 }}>
        <span className="text-gray-400">
          编码: {productCode}
        </span>
        <span className="text-gray-400">
          条码: {barcode}
        </span>
      </div>

      {/* 规格和单位徽章 */}
      {(spec || unit) && (
        <div className="flex items-center gap-2 mt-2">
          {spec && (
            <span
              className="inline-block rounded bg-gray-100 text-gray-600 px-1.5 py-0.5"
              style={{ fontSize: 11 }}
            >
              {spec}
            </span>
          )}
          {unit && (
            <span
              className="inline-block rounded bg-blue-50 text-primary px-1.5 py-0.5"
              style={{ fontSize: 11 }}
            >
              {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const MemoizedProductCard = memo(ProductCard);
export default MemoizedProductCard;
export { ProductCard };
