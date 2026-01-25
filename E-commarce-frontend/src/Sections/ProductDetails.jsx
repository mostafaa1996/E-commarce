import ProductGallery from "../../components/ProductDetails/ProductGallery";
import ProductHeader from "../../components/ProductDetails/ProductHeader";
import ProductMeta from "../../components/ProductDetails/ProductMeta";
import ProductsVariantsShow from "../../components/ProductDetails/ProductsVariantsShow";
import ProductActions from "../../components/ProductDetails/ProductAction";
import QuantityControl from "../../components/genericComponents/QuantityControl";
import { useState } from "react";
export default function ProductDetails({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  function handleDecrement() {}
  function handleIncrement() {}
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-10">
          <ProductGallery
            images={product.images}
            active={activeImage}
            onChange={setActiveImage}
          />

          <div className="flex flex-col gap-6">
            <ProductHeader
              title={product.title}
              price={product.price}
              rating={product.rating}
              description={product.shortDescription}
            />

            <div
              className="h-[12px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #D4D4D4 0 2px, transparent 2px 10px)",
              }}
            />

            <ProductsVariantsShow
              label="Color"
              options={product.variants?.colors || []}
            />
            <ProductsVariantsShow
              label="Size"
              options={product.variants?.sizes || []}
            />

            <QuantityControl />

            <ProductActions />

            <div
              className="h-[12px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #D0D0D0 0 2px, transparent 2px 10px)",
              }}
            />

            <ProductMeta
              sku={product.sku}
              category={product.category}
              tags={product.tags}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
