import {columns} from "../../src/Data/HomeProducts";
import ProductColumn from "../genericComponents/ProductsColumn";

export default function HomeProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        ">
          {columns.map((col) => (
            <ProductColumn
              key={col.title}
              title={col.title}
              items={col.items}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
