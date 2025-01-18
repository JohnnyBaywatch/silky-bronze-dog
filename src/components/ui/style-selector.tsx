"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Book, Check } from "lucide-react"

export type NovelStyle = {
  id: string
  name: string
  description: string
  imageQuery: string
}

export const novelStyles: NovelStyle[] = [
  {
    id: "manga",
    name: "Manga",
    description: "Japanese comic style with dynamic action and expressive characters",
    imageQuery: "manga,anime,japanese-art"
  },
  {
    id: "american",
    name: "American Comics",
    description: "Bold, superhero-inspired style with dynamic action and strong colors",
    imageQuery: "superhero,comic-book,american-comics"
  },
  {
    id: "european",
    name: "European Comics",
    description: "Clear line art with detailed backgrounds and sophisticated storytelling",
    imageQuery: "european-comics,ligne-claire"
  },
  {
    id: "webcomic",
    name: "Webcomics",
    description: "Modern digital style optimized for screen viewing",
    imageQuery: "webcomic,digital-art"
  },
  {
    id: "biographical",
    name: "Autobiographical/Non-Fiction",
    description: "Personal narratives with realistic and intimate storytelling",
    imageQuery: "documentary,journalism,realistic"
  },
  {
    id: "literary",
    name: "Literary Graphic Novels",
    description: "Sophisticated visual narratives with complex themes",
    imageQuery: "literary,artistic,sophisticated"
  },
  {
    id: "experimental",
    name: "Art House/Experimental",
    description: "Avant-garde visuals pushing artistic boundaries",
    imageQuery: "experimental,abstract,avant-garde"
  },
  {
    id: "fantasy",
    name: "Fantasy/Sci-Fi",
    description: "Imaginative worlds with fantastical or futuristic elements",
    imageQuery: "fantasy,sci-fi,conceptual"
  },
  {
    id: "horror",
    name: "Horror",
    description: "Dark and atmospheric with emphasis on tension and fear",
    imageQuery: "horror,dark,atmospheric"
  },
  {
    id: "slice",
    name: "Slice of Life",
    description: "Everyday stories with focus on character relationships",
    imageQuery: "slice-of-life,daily-life,casual"
  },
  {
    id: "underground",
    name: "Underground/Alternative",
    description: "Counter-cultural style with raw, edgy aesthetics",
    imageQuery: "underground,alternative,indie"
  }
]

interface StyleSelectorProps {
  selectedStyle: string
  onSelectStyle: (style: NovelStyle) => void
}

export function StyleSelector({
  selectedStyle,
  onSelectStyle
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {novelStyles.map((style) => (
        <motion.button
          key={style.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectStyle(style)}
          className={cn(
            "group relative flex aspect-[4/3] flex-col items-start justify-end overflow-hidden rounded-lg border-2 p-4 shadow-sm transition-colors",
            selectedStyle === style.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity group-hover:opacity-30"
            style={{
              backgroundImage: `url(https://source.unsplash.com/featured/400x300?${encodeURIComponent(style.imageQuery)})`
            }}
          />
          <div className="relative space-y-1">
            <h3 className="font-semibold">{style.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {style.description}
            </p>
          </div>
          {selectedStyle === style.id && (
            <div className="absolute right-2 top-2">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  )
}
