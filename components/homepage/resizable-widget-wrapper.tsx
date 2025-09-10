"use client"

import type React from "react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { WidgetResizer, type WidgetDimensions } from "@/lib/widget-resize"
import { trackWidgetResize, trackWidgetDrag } from "@/lib/widget-tracker"
import { GripVertical, Minimize2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResizableWidgetWrapperProps {
  children: ReactNode
  widgetId: string
  onResize?: (dimensions: WidgetDimensions) => void
  onMove?: (position: { x: number; y: number }) => void
  isEditMode?: boolean
  className?: string
  title?: string
  initialDimensions?: WidgetDimensions
}

export function ResizableWidgetWrapper({
  children,
  widgetId,
  onResize,
  onMove,
  isEditMode = false,
  className = "",
  title,
  initialDimensions,
}: ResizableWidgetWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<WidgetResizer | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 })
  const [currentDimensions, setCurrentDimensions] = useState<WidgetDimensions | null>(initialDimensions || null)

  useEffect(() => {
    if (containerRef.current && isEditMode) {
      const rect = containerRef.current.getBoundingClientRect()
      const dimensions: WidgetDimensions = currentDimensions || {
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
        minWidth: 200,
        minHeight: 150,
        maxWidth: 1200,
        maxHeight: 800,
      }

      setCurrentDimensions(dimensions)

      resizerRef.current = new WidgetResizer(containerRef.current, dimensions, (newDimensions) => {
        setCurrentDimensions(newDimensions)
        onResize?.(newDimensions)
        // Track widget resize
        trackWidgetResize(widgetId, newDimensions, title)
      })

      return () => {
        resizerRef.current?.destroy()
      }
    } else if (!isEditMode && resizerRef.current) {
      resizerRef.current.destroy()
      resizerRef.current = null
    }
  }, [isEditMode, onResize])

  // Apply saved dimensions when they change
  useEffect(() => {
    if (resizerRef.current && currentDimensions) {
      resizerRef.current.setDimensions(currentDimensions)
    }
  }, [currentDimensions])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode || e.target !== e.currentTarget) return

    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: rect.left,
      elementY: rect.top,
    })

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "move"
    document.body.style.userSelect = "none"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    const newX = deltaX
    const newY = deltaY

    containerRef.current.style.transform = `translate(${newX}px, ${newY}px)`
    onMove?.({ x: newX, y: newY })
    // Track widget drag
    trackWidgetDrag(widgetId, { x: newX, y: newY }, title)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "default"
    document.body.style.userSelect = "auto"
  }

  return (
    <div
      ref={containerRef}
      className={`
        relative transition-all duration-200 ease-in-out
        ${isEditMode ? "cursor-move" : ""}
        ${isDragging ? "z-50 shadow-2xl scale-105" : ""}
        ${isHovered && isEditMode ? "ring-2 ring-blue-400 ring-opacity-50" : ""}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        currentDimensions && isEditMode
          ? {
              width: `${currentDimensions.width}px`,
              height: `${currentDimensions.height}px`,
            }
          : {}
      }
    >
      {/* Edit Mode Toolbar */}
      {isEditMode && isHovered && (
        <div className="absolute -top-8 left-0 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 flex items-center space-x-1 z-50">
          <GripVertical className="w-3 h-3 text-gray-400" />
          {title && <span className="text-xs font-medium text-gray-600">{title}</span>}
          {currentDimensions && (
            <span className="text-xs text-gray-500">
              {Math.round(currentDimensions.width)} × {Math.round(currentDimensions.height)}
            </span>
          )}
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => e.stopPropagation()}>
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => e.stopPropagation()}>
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className="w-full h-full overflow-hidden rounded-lg" onClick={(e) => isEditMode && e.stopPropagation()}>
        {children}
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none" />
      )}

      {/* Resize Indicator */}
      {isEditMode && isHovered && (
        <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white/80 px-1 rounded">Resize</div>
      )}
    </div>
  )
}
