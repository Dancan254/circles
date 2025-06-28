import Lottie from "lottie-react";
import loading from "@/assets/lottie/wallets.json";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Loading({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        size === "xs"
          ? "h-1/4"
          : size === "sm"
          ? "h-1/2"
          : size === "md"
          ? "h-1/2"
          : "h-screen"
      )}
    >
      <Lottie animationData={loading} loop={true} />
      <p className="text-muted-foreground text-sm flex items-center mt-4 text-center">
        Processing
        <span className="animate-spin ml-2">
          <Loader2 className="w-4 h-4" />
        </span>
      </p>
    </div>
  );
}

export default Loading;
