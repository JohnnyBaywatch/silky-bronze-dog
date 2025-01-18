"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export type LayoutTemplate = {
  id: string
  name: string
  columns: number
  rows: number
  areas: string[][]
}

const templates: LayoutTemplate[] = [
  {
    id: "single",
    name: "Single Panel",
    columns: 1,
    rows: 1,
    areas: [["main"]]
  },
  {
    id: "sideBySide",
    name: "Side by Side",
    columns: 2,
    rows: 1,
    areas: [["left", "right"]]
  },
  {
    id: "threePanel",
    name: "Three Panel",
    columns: 3,
    rows: 1,
    areas: [["left", "center", "right"]]
  },
  {
    id: "fourGrid",
    name: "Four Grid",
    columns: 2,
    rows: 2,
    areas: [
      ["topLeft", "topRight"],
      ["bottomLeft", "bottomRight"]
    ]
  }
]

interface LayoutSelectorProps {
  selectedLayout: string
  onSelectLayout: (layout: LayoutTemplate) => void
}

export function LayoutSelector({
  selectedLayout,
  onSelectLayout
}: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {templates.map((template) => (
        <motion.button
          key={template.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectLayout(template)}
          className={cn(
            "relative flex aspect-video flex-col items-center justify-center rounded-lg border-2 p-4 shadow-sm transition-colors",
            selectedLayout === template.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div
            className="grid h-full w-full gap-2"
            style={{
              gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
              gridTemplateRows: `repeat(${template.rows}, 1fr)`
            }}
          >
            {template.areas.flat().map((area) => (
              <div
                key={area}
                className="rounded-md bg-muted/50 transition-colors hover:bg-muted/70"
              />
            ))}
          </div>
          <p className="mt-2 text-sm font-medium">{template.name}</p>
          {selectedLayout === template.id && (
            <div className="absolute right-2 top-2">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export { templates }
