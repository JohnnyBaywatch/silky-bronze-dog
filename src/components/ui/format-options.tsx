"use client"

import { motion } from "framer-motion"
import { Book, Download, FileText, Printer, X } from "lucide-react"
import { Button } from "./button"

interface FormatOptionsProps {
  isOpen: boolean
  onClose: () => void
  onFormat: (format: 'digital' | 'print') => void
}

export function FormatOptions({ isOpen, onClose, onFormat }: FormatOptionsProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-lg bg-card p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Format Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onFormat('digital')}
            className="group flex flex-col items-center rounded-lg border-2 border-transparent bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <FileText className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-semibold">Digital Format</h3>
            <p className="text-center text-sm text-muted-foreground">
              Optimize for digital reading on devices and e-readers
            </p>
          </button>

          <button
            onClick={() => onFormat('print')}
            className="group flex flex-col items-center rounded-lg border-2 border-transparent bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <Printer className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
            <h3 className="mb-2 font-semibold">Print Format</h3>
            <p className="text-center text-sm text-muted-foreground">
              Format for physical printing and book publication
            </p>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
