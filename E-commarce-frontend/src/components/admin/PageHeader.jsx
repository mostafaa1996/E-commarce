import { Link } from "react-router-dom";
import Icon from "@/system/icons/Icon";

export function PageHeader({ title, description, breadcrumbs, actions }) {
  return (
    <div className="page-header animate-fade-in">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <Icon name="chevronRight" className="h-3 w-3" />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
