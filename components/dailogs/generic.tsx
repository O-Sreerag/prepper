"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GenericDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function GenericDialog({ open, onOpenChange, title, description, children }: GenericDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-xl md:max-w-xl lg:max-w-2xl xl:max-w-4xl p-4 md:p-6 flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto space-y-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
