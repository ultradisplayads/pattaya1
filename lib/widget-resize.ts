export interface WidgetDimensions {
  width: number
  height: number
  x: number
  y: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export class WidgetResizer {
  private element: HTMLElement
  private dimensions: WidgetDimensions
  private handles: HTMLElement[] = []
  private isResizing = false
  private currentHandle: string | null = null
  private startMousePos = { x: 0, y: 0 }
  private startDimensions: WidgetDimensions
  private onResize?: (dimensions: WidgetDimensions) => void

  constructor(
    element: HTMLElement,
    initialDimensions: WidgetDimensions,
    onResize?: (dimensions: WidgetDimensions) => void,
  ) {
    this.element = element
    this.dimensions = { ...initialDimensions }
    this.startDimensions = { ...initialDimensions }
    this.onResize = onResize
    this.createHandles()
    this.attachEventListeners()
    this.applyDimensions()
  }

  private createHandles() {
    const handlePositions = [
      {
        name: "n",
        cursor: "ns-resize",
        style: "top: -4px; left: 50%; transform: translateX(-50%); width: 20px; height: 8px;",
      },
      {
        name: "s",
        cursor: "ns-resize",
        style: "bottom: -4px; left: 50%; transform: translateX(-50%); width: 20px; height: 8px;",
      },
      {
        name: "e",
        cursor: "ew-resize",
        style: "right: -4px; top: 50%; transform: translateY(-50%); width: 8px; height: 20px;",
      },
      {
        name: "w",
        cursor: "ew-resize",
        style: "left: -4px; top: 50%; transform: translateY(-50%); width: 8px; height: 20px;",
      },
      { name: "ne", cursor: "nesw-resize", style: "top: -4px; right: -4px; width: 8px; height: 8px;" },
      { name: "nw", cursor: "nwse-resize", style: "top: -4px; left: -4px; width: 8px; height: 8px;" },
      { name: "se", cursor: "nwse-resize", style: "bottom: -4px; right: -4px; width: 8px; height: 8px;" },
      { name: "sw", cursor: "nesw-resize", style: "bottom: -4px; left: -4px; width: 8px; height: 8px;" },
    ]

    handlePositions.forEach(({ name, cursor, style }) => {
      const handle = document.createElement("div")
      handle.className = "resize-handle"
      handle.dataset.handle = name
      handle.style.cssText = `
        position: absolute;
        background: #2563eb;
        border: 1px solid white;
        border-radius: 2px;
        opacity: 0;
        transition: opacity 0.2s ease;
        cursor: ${cursor};
        z-index: 1000;
        ${style}
      `

      this.element.appendChild(handle)
      this.handles.push(handle)
    })
  }

  private attachEventListeners() {
    this.element.addEventListener("mouseenter", () => {
      this.handles.forEach((handle) => {
        handle.style.opacity = "0.8"
      })
    })

    this.element.addEventListener("mouseleave", () => {
      if (!this.isResizing) {
        this.handles.forEach((handle) => {
          handle.style.opacity = "0"
        })
      }
    })

    this.handles.forEach((handle) => {
      handle.addEventListener("mousedown", this.handleMouseDown.bind(this))
    })
  }

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as HTMLElement
    this.currentHandle = target.dataset.handle || null
    this.isResizing = true
    this.startMousePos = { x: e.clientX, y: e.clientY }
    this.startDimensions = { ...this.dimensions }

    document.addEventListener("mousemove", this.handleMouseMove)
    document.addEventListener("mouseup", this.handleMouseUp)
    document.body.style.cursor = target.style.cursor
    document.body.style.userSelect = "none"

    this.element.style.outline = "2px solid #2563eb"
    this.element.style.outlineOffset = "2px"
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isResizing || !this.currentHandle) return

    const deltaX = e.clientX - this.startMousePos.x
    const deltaY = e.clientY - this.startMousePos.y

    const newDimensions = { ...this.startDimensions }

    switch (this.currentHandle) {
      case "n":
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height - deltaY)
        break
      case "s":
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height + deltaY)
        break
      case "e":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width + deltaX)
        break
      case "w":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width - deltaX)
        break
      case "ne":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width + deltaX)
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height - deltaY)
        break
      case "nw":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width - deltaX)
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height - deltaY)
        break
      case "se":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width + deltaX)
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height + deltaY)
        break
      case "sw":
        newDimensions.width = Math.max(this.dimensions.minWidth || 100, this.startDimensions.width - deltaX)
        newDimensions.height = Math.max(this.dimensions.minHeight || 100, this.startDimensions.height + deltaY)
        break
    }

    if (this.dimensions.maxWidth) {
      newDimensions.width = Math.min(newDimensions.width, this.dimensions.maxWidth)
    }
    if (this.dimensions.maxHeight) {
      newDimensions.height = Math.min(newDimensions.height, this.dimensions.maxHeight)
    }

    this.setDimensions(newDimensions)
    this.onResize?.(newDimensions)
  }

  private handleMouseUp = () => {
    this.isResizing = false
    this.currentHandle = null

    document.removeEventListener("mousemove", this.handleMouseMove)
    document.removeEventListener("mouseup", this.handleMouseUp)
    document.body.style.cursor = "default"
    document.body.style.userSelect = "auto"

    this.element.style.outline = "none"
    this.element.style.outlineOffset = "0"

    this.handles.forEach((handle) => {
      handle.style.opacity = "0"
    })
  }

  private applyDimensions() {
    this.element.style.width = `${this.dimensions.width}px`
    this.element.style.height = `${this.dimensions.height}px`
    this.element.style.position = "relative"
  }

  public setDimensions(dimensions: Partial<WidgetDimensions>) {
    this.dimensions = { ...this.dimensions, ...dimensions }
    this.applyDimensions()
  }

  public getDimensions(): WidgetDimensions {
    return { ...this.dimensions }
  }

  public destroy() {
    this.handles.forEach((handle) => {
      if (handle.parentNode) {
        handle.parentNode.removeChild(handle)
      }
    })
    this.handles = []

    document.removeEventListener("mousemove", this.handleMouseMove)
    document.removeEventListener("mouseup", this.handleMouseUp)
  }
}
