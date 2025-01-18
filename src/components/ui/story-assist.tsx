"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, X } from "lucide-react"

const storyThemes = [
  { name: "Dramatic", keywords: ["tension", "conflict", "emotional", "intense"] },
  { name: "Romantic", keywords: ["love", "passion", "tender", "intimate"] },
  { name: "Chaotic", keywords: ["wild", "unpredictable", "frenzied", "turbulent"] },
  { name: "Mysterious", keywords: ["enigmatic", "suspenseful", "cryptic", "shadowy"] },
  { name: "Melancholic", keywords: ["sad", "wistful", "somber", "gloomy"] },
  { name: "Whimsical", keywords: ["playful", "quirky", "magical", "lighthearted"] },
]

interface StoryAssistProps {
  prompt: string
  onSuggestionClick: (suggestion: string) => void
  isOpen: boolean
  onClose: () => void
}

export function StoryAssist({ prompt, onSuggestionClick, isOpen, onClose }: StoryAssistProps) {
  if (!isOpen) return null

  // Analyze prompt for themes
  const matchingThemes = storyThemes.filter(theme =>
    theme.keywords.some(keyword =>
      prompt.toLowerCase().includes(keyword.toLowerCase())
    )
  )

  // Generate suggestions based on matching themes
  const generateSuggestions = (theme: typeof storyThemes[0]) => {
    const suggestions = [
      `Continue the ${theme.name.toLowerCase()} mood with "${theme.keywords[0]} shadows and lighting"`,
      `Add a ${theme.keywords[1]} moment to heighten the ${theme.name.toLowerCase()} atmosphere`,
      `Introduce a ${theme.keywords[2]} element to enhance the ${theme.name.toLowerCase()} feeling`
    ]
    return suggestions
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full z-10 mt-2 w-96 rounded-lg border bg-card p-4 shadow-lg"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold">
          <Sparkles className="mr-2 h-5 w-5" />
          Story Suggestions
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {matchingThemes.length > 0 ? (
        <div className="space-y-3">
          {matchingThemes.map((theme) => (
            <div key={theme.name} className="space-y-2">
              <h4 className="font-medium text-primary">{theme.name} Theme Detected</h4>
              <div className="space-y-2">
                {generateSuggestions(theme).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Try adding emotional keywords to your prompt to get theme-based suggestions.
        </p>
      )}
    </motion.div>
  )
}
