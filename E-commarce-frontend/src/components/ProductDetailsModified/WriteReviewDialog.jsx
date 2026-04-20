import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/adminUI/dialog";
import InputField from "@/components/genericComponents/InputField";
import { Label } from "@/components/genericComponents/Label";
import TextArea from "@/components/genericComponents/TextArea";
import { Star, ShieldCheck, UserCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WriteReviewDialog = ({ open, onOpenChange, isLoggedIn = false, currentUser, onSubmit }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setHover(0);
    setComment("");
    setUsername("");
    setEmail("");
  };

  const handleClose = (next) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Please write a comment", variant: "destructive" });
      return;
    }
    if (!isLoggedIn) {
      if (!username.trim()) {
        toast({ title: "Please enter your name", variant: "destructive" });
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!emailOk) {
        toast({ title: "Please enter a valid email", variant: "destructive" });
        return;
      }
    }

    setSubmitting(true);
    const payload = {
      rating,
      comment: comment.trim(),
      username: !isLoggedIn? username.trim() : "",
      email: !isLoggedIn? email.trim() : "",
      verified: isLoggedIn,
      date: new Date().toISOString(),
    };

    setTimeout(() => {
      onSubmit?.(payload);
      toast({
        title: "Review submitted",
        description: "Thanks for sharing your feedback!",
      });
      setSubmitting(false);
      handleClose(false);
    }, 400);
  };

  const ratingLabels = ["Tap to rate", "Poor", "Fair", "Good", "Very good", "Excellent"];
  const activeLabel = ratingLabels[hover || rating];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl border-border p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-soft to-background px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Write a review</DialogTitle>
            <DialogDescription>
              Share your experience to help other shoppers make confident choices.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Auth status pill */}
          {isLoggedIn ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
              Signed in as {currentUser || "you"} · Verified buyer
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <UserCircle2 className="h-3.5 w-3.5" />
              Posting as a guest
            </div>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Your rating</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = (hover || rating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="rounded-md p-1 transition-smooth hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <Star
                        className={`h-7 w-7 transition-smooth ${
                          active ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-sm font-medium text-muted-foreground">{activeLabel}</span>
            </div>
          </div>

          {/* Guest fields */}
          {!isLoggedIn && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="rv-name" className="text-sm font-semibold text-foreground">Name</Label>
                <InputField
                  id="rv-name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Jane Doe"
                  maxLength={60}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rv-email" className="text-sm font-semibold text-foreground">Email</Label>
                <InputField
                  id="rv-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={120}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="rv-comment" className="text-sm font-semibold text-foreground">Your review</Label>
            <TextArea
              id="rv-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the quality?"
              rows={4}
              maxLength={1000}
              className="rounded-xl resize-none"
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-muted-foreground">{comment.length}/1000</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-smooth hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewDialog;
