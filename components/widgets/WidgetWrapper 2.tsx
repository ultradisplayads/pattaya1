'use client';

import { ReactNode } from 'react';
import { useWidgetPermissions } from '@/hooks/use-widget-permissions';
import { cn } from '@/lib/utils';

interface WidgetWrapperProps {
  widgetId: string;
  children: ReactNode;
  className?: string;
  onResize?: () => void;
  onDrag?: () => void;
  onDelete?: () => void;
}

export function WidgetWrapper({ 
  widgetId, 
  children, 
  className,
  onResize,
  onDrag,
  onDelete 
}: WidgetWrapperProps) {
  const { canResize, canDrag, canDelete, isLocked } = useWidgetPermissions();

  const resizeEnabled = canResize(widgetId);
  const dragEnabled = canDrag(widgetId);
  const deleteEnabled = canDelete(widgetId);
  const locked = isLocked(widgetId);

  return (
    <div
      className={cn(
        'relative group',
        {
          'cursor-move': dragEnabled && !locked,
          'cursor-not-allowed': locked,
          'resize': resizeEnabled && !locked,
        },
        className
      )}
      draggable={dragEnabled && !locked}
      onDragStart={dragEnabled && !locked ? onDrag : undefined}
    >
      {children}
      
      {/* Widget Controls */}
      {!locked && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            {resizeEnabled && (
              <button
                onClick={onResize}
                className="p-1 bg-white/80 hover:bg-white rounded shadow-sm"
                title="Resize widget"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
            )}
            {deleteEnabled && (
              <button
                onClick={onDelete}
                className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded shadow-sm"
                title="Delete widget"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Locked Indicator */}
      {locked && (
        <div className="absolute top-2 right-2">
          <div className="p-1 bg-yellow-500/80 text-white rounded shadow-sm">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
