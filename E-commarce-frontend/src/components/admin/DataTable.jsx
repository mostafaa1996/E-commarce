import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/adminUI/table";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataTable({
  columns, data, page = 1, totalPages = 1, onPageChange,
}) {
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className || ""}`}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-secondary/30 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <AdminButton variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </AdminButton>
            <AdminButton variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
