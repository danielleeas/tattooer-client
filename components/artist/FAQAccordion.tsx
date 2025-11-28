"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQCategoryWithItems } from "@/lib/api/artist";

interface FAQAccordionProps {
  categories: FAQCategoryWithItems[];
  className?: string;
}

export function FAQAccordion({ categories, className }: FAQAccordionProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No FAQs available yet.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {categories.map((category) => (
        <div key={category.id} className="mb-6">
          <h2 className="text-2xl text-foreground mb-2">
            {category.category_name}
          </h2>
          <AccordionPrimitive.Root
            type="single"
            collapsible
            className="w-full space-y-0"
          >
            {category.items.map((item) => (
              <AccordionPrimitive.Item
                key={item.id}
                value={item.id}
                className="border-b border-border"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between py-4 text-left text-sm font-normal transition-all hover:underline group cursor-pointer"
                    )}
                  >
                    <span className="flex-1 pr-4 text-xl">{item.question}</span>
                    <div className="shrink-0 relative w-4 h-4 flex items-center justify-center">
                      <Plus className="h-4 w-4 absolute transition-opacity group-data-[state=open]:opacity-0" />
                      <Minus className="h-4 w-4 absolute opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden text-muted-foreground leading-snug data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="pb-4 pt-0">{item.answer}</div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </div>
      ))}
    </div>
  );
}
