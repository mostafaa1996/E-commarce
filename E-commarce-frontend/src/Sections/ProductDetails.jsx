import ProductGallery from "@/components/ProductDetails/ProductGallery";
import ProductHeader from "@/components/ProductDetails/ProductHeader";
import ProductMeta from "@/components/ProductDetails/ProductMeta";
import ProductsVariantsShow from "@/components/ProductDetails/ProductsVariantsShow";
import ProductActions from "@/components/ProductDetails/ProductAction";
import QuantityControl from "@/components/genericComponents/QuantityControl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateUserWishlist } from "@/APIs/UserProfileService";
import { queryClient } from "../queryClient";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { syncCart } from "@/APIs/CartService";
export default function ProductDetails({
  product,
  initialValueFromUserWishlist,
  intialQuantity = 0,
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(intialQuantity);
  const [displayQuantity, setDisplayQuantity] = useState(intialQuantity);
  const navigate = useNavigate();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const updateWishlist = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });

  const UpdateCart = useMutation({
    mutationFn: ({ ActionType, productId, quantity }) =>
      syncCart({ ActionType, productId, quantity }),
    onMutate: async ({ ActionType, productId, quantity }) => {
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      const previousDisplayQuantity = displayQuantity;

      if (ActionType === "add") {
        setDisplayQuantity(quantity);
      }

      if (ActionType === "remove") {
        setDisplayQuantity(0);
      }
      queryClient.setQueryData(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;
        const oldItems = oldCart.items || [];

        if (ActionType === "add") {
          return {
            ...oldCart,
            items: [...oldItems, { _id: productId, quantity }],
          };
        }

        if (ActionType === "remove") {
          return {
            ...oldCart,
            items: oldItems.filter((item) => item._id !== productId),
          };
        }

        return oldCart;
      });
      return { previousCart, previousDisplayQuantity };
    },
    onError: (context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      if (context) {
        setDisplayQuantity(context.previousDisplayQuantity);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  function handleAddToCart() {
    UpdateCart.mutate({ ActionType: "add", productId: product._id, quantity });
  }
  function RemoveFromCart() {
    UpdateCart.mutate({ ActionType: "remove", productId: product._id, quantity: 0 });
  }
  function handleAddToWishlist() {
    updateWishlist.mutate([product._id]);
  }
  function handleOrderNow() {
    navigate("/checkout");
  }
  function handleSelectVariantColor() {}
  function handleSelectVariantSize() {}

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-40">
          <ProductGallery
            images={product.images}
            active={activeImage}
            onChange={setActiveImage}
          />

          <div className="flex flex-col gap-6">
            <ProductHeader
              title={product.title}
              price={format(product.price * rate)}
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
              handleChoice={handleSelectVariantColor}
            />
            <ProductsVariantsShow
              label="Size"
              options={product.variants?.sizes || []}
              handleChoice={handleSelectVariantSize}
            />

            {displayQuantity === 0 && (
              <QuantityControl value={quantity} onChange={setQuantity} />
            )}
            {displayQuantity !== 0 && (
              <div className="text-xl text-green-500">
                Quantity added to cart : {displayQuantity}
              </div>
            )}

            <ProductActions
              OrderHandler={handleOrderNow}
              AddToCartHandler={
                displayQuantity === 0 ? handleAddToCart : RemoveFromCart
              }
              AddToWishlistHandler={handleAddToWishlist}
              AddedToWishlistBefore={initialValueFromUserWishlist}
              ADDButtonText={
                displayQuantity === 0 ? "Add To Cart" : "Remove From Cart"
              }
            />

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
