import { useState } from "react";
import DescriptionTab from "../../components/ProductDetails/Tabs/DescriptionTab";
import ReviewsTab from "../../components/ProductDetails/Tabs/ReviewTab";
import TabsHeader from "../../components/ProductDetails/Tabs/TabsHeader";
export default function ProductTabs({ product }) {
  const [active, setActive] = useState("description");

  return (
    <section className="mt-20">
      <TabsHeader active={active} onChange={setActive} ReviewsCount={product.reviews.length} />

      <div className="mt-10">
        {active === "description" && (
          <DescriptionTab
            text={product.description}
            bullets={product.bullets||[]}
          />
        )}

        {active === "reviews" && (
          <ReviewsTab reviews={product.reviews} />
        )}
      </div>
    </section>
  );
}
