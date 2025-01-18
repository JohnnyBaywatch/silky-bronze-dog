"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Loader2, LayoutTemplate as LayoutIcon, RefreshCw, Sparkles, Book, Trash2, Download } from "lucide-react"
import { FormatOptions } from "@/components/ui/format-options"
import { StoryAssist } from "@/components/ui/story-assist"
import { StyleSelector, type NovelStyle, novelStyles } from "@/components/ui/style-selector"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LayoutSelector, type LayoutTemplate, templates } from "@/components/ui/layout-selector"

export default function HomePage() {
  const [selectedStyle, setSelectedStyle] = useState<NovelStyle>(novelStyles[0]!)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState<LayoutTemplate>(templates[0]!)
  const [isStoryAssistOpen, setIsStoryAssistOpen] = useState(false)
  const [isFormatOptionsOpen, setIsFormatOptionsOpen] = useState(false)

  // Load saved project on mount
  useEffect(() => {
    const savedProject = localStorage.getItem('graphicNovelProject')
    if (savedProject) {
      const project = JSON.parse(savedProject)
      setSelectedStyle(project.style)
      setSelectedLayout(project.layout)
      setPanels(project.panels)
    }
  }, [])

  const handleFormat = (format: 'digital' | 'print') => {
    const projectData = {
      style: selectedStyle,
      layout: selectedLayout,
      panels: panels,
      format: format,
      metadata: {
        title: "My Graphic Novel",
        author: "Author Name",
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    }
    
    // In a real app, this would trigger a backend process
    // For now, we'll just download the JSON
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `graphic-novel-${format}-format.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsFormatOptionsOpen(false)
  }
  const [panels, setPanels] = useState<Array<{
    id: number
    image: string
    prompt: string
    createdAt: string
    position: string
    style: string
  }>>([])

  // Load stored panels on mount
  useEffect(() => {
    const storedPanels = JSON.parse(localStorage.getItem('graphicNovelPanels') || '[]')
    setPanels(storedPanels)
  }, [])

  const generatePanel = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      // Use Unsplash API with the prompt to get a relevant image
      const searchTerm = prompt.split(' ').slice(0, 3).join(',')
      const newPanel = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(searchTerm)},illustration,art`
      
      // Find the next available position in the current layout
      const usedPositions = panels.map(p => p.position)
      const availablePosition = selectedLayout.areas.flat().find(pos => !usedPositions.includes(pos))

      if (!availablePosition) {
        alert("All positions in the current layout are filled. Please choose a different layout or clear some panels.")
        return
      }

      // Create a new panel with metadata
      const panelData = {
        id: Date.now(),
        image: newPanel,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        position: availablePosition,
        style: selectedStyle.id
      }

      // Update state and localStorage
      setPanels(prev => {
        const newPanels = [...prev, panelData]
        localStorage.setItem('graphicNovelPanels', JSON.stringify(newPanels))
        return newPanels
      })

      setPrompt("")
    } catch (error) {
      console.error('Failed to generate panel:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearPanels = () => {
    setPanels([])
    localStorage.removeItem('graphicNovelPanels')
  }

  return (
    <div className="min-h-screen bg-background p-12">
      <div className="mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Graphic Novel Generator
        </motion.h1>
        
        <div className="mb-8 space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <Book className="mr-2 h-5 w-5" />
              Choose Style
            </h2>
            <StyleSelector
              selectedStyle={selectedStyle.id}
              onSelectStyle={setSelectedStyle}
            />
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <LayoutIcon className="mr-2 h-5 w-5" />
              Choose Layout
            </h2>
            <LayoutSelector
              selectedLayout={selectedLayout.id}
              onSelectLayout={setSelectedLayout}
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Describe your story panel..."
                className="min-h-[100px] resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <StoryAssist
                prompt={prompt}
                onSuggestionClick={setPrompt}
                isOpen={isStoryAssistOpen}
                onClose={() => setIsStoryAssistOpen(false)}
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearPanels}
                className="text-destructive hover:bg-destructive/10"
              >
                Clear All Panels
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPrompt("")}
                  disabled={!prompt || loading}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsStoryAssistOpen(!isStoryAssistOpen)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Story Assist
                </Button>
                <Button
                  onClick={generatePanel}
                  disabled={!prompt || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Generate Panel
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const projectData = {
                      style: selectedStyle,
                      layout: selectedLayout,
                      panels: panels,
                      lastModified: new Date().toISOString()
                    }
                    localStorage.setItem('graphicNovelProject', JSON.stringify(projectData))
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Save Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFormatOptionsOpen(true)}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Format
                </Button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="relative rounded-xl border-2 border-primary/10 bg-card p-4 shadow-lg"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)`,
            gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
            gap: "1rem",
            aspectRatio: selectedLayout.rows === 1 ? "3/1" : "2/1"
          }}
        >
          {selectedLayout.areas.flat().map((area) => {
            const panel = panels.find((p) => p.position === area)
            return (
              <motion.div
                key={area}
                layout
                className={cn(
                  "group relative overflow-hidden rounded-lg",
                  !panel && "bg-muted/50 hover:bg-muted/70"
                )}
              >
                {panel ? (
                  <>
                    <img
                      src={panel.image}
                      alt={panel.prompt}
                      className="h-full w-full object-cover transition-all duration-300 hover:object-contain"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{panel.prompt}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            {new Date(panel.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white/90"
                            onClick={() => {
                              const newPanels = panels.filter(p => p.id !== panel.id)
                              setPanels(newPanels)
                              localStorage.setItem('graphicNovelPanels', JSON.stringify(newPanels))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white/90"
                            onClick={() => {
                              setPrompt(panel.prompt)
                              const newPanels = panels.filter(p => p.id !== panel.id)
                              setPanels(newPanels)
                              localStorage.setItem('graphicNovelPanels', JSON.stringify(newPanels))
                              generatePanel()
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <p className="text-sm text-muted-foreground">Empty Panel</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (prompt) {
                          generatePanel()
                        }
                      }}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Panel
                    </Button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <FormatOptions
        isOpen={isFormatOptionsOpen}
        onClose={() => setIsFormatOptionsOpen(false)}
        onFormat={handleFormat}
      />
    </div>
  )
}
