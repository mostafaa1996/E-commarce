import * as Icons from "lucide-react";
import LandingSection from "./LandingSection";

export default function CategoriesSection({ categories , icons}) {
  return (
    <LandingSection
      title="Featured Categories"
      subtitle="Browse top categories handpicked for you"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories && categories.map((category) => {
          const Icon = Icons[icons?.find((i) => i.name === category.name)?.icon] || Icons.Box;
          
          return (
            <a
              key={category.name}
              href={`/shop/products?category=${category.name}&page=1&limit=12`}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{category.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {category.keywords}
              </p>
            </a>
          );
        })}
      </div>
    </LandingSection>
  );
}
