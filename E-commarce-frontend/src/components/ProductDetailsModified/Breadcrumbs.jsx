import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ items = [] }) => (
  <nav aria-label="Breadcrumb" className="container py-4">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm">
      <li>
        <a href="/" className="flex items-center gap-1 text-muted-foreground transition-smooth hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only">Home</span>
        </a>
      </li>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {i === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <a href={item.href || "#"} className="text-muted-foreground transition-smooth hover:text-primary">
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;