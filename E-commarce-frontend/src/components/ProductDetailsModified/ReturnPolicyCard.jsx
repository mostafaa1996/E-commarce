import { RotateCcw, Check, X, Clock, Wallet } from "lucide-react";

const ReturnPolicyCard = ({ policy }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          policy.isReturnAccepted ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}
      >
        {policy.isReturnAccepted ? <Check className="h-5 w-5" strokeWidth={3} /> : <X className="h-5 w-5" strokeWidth={3} />}
      </div>
      <div>
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {policy.isReturnAccepted ? "Returns accepted" : "Returns not accepted"}
        </h3>
        <p className="text-xs text-muted-foreground">Easy & transparent return policy</p>
      </div>
    </div>

    {policy.isReturnAccepted && (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/60 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Window
          </div>
          <div className="text-sm font-bold text-foreground">{policy.returnWindowDays} days</div>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" /> Fees paid by
          </div>
          <div className="text-sm font-bold capitalize text-foreground">{policy.returnFeesPaidBy}</div>
        </div>
      </div>
    )}

    {policy.notes && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{policy.notes}</p>}
  </div>
);

export default ReturnPolicyCard;
