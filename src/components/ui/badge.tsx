import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-900",
        destructive: "bg-red-100 text-red-800 hover:bg-red-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        outline: "border border-slate-300 bg-transparent text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
}

function Badge({ className, variant, onRemove, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-1"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
