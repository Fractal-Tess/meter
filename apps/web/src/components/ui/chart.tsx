import * as React from "react"
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { TooltipProps } from "recharts"

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
    unit: string;
    gradientId: string;
  };
};

type ChartContainerProps = {
  children: React.ReactElement
  className?: string
}

export function ChartContainer({
  children,
  className,
}: ChartContainerProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

type ChartTooltipProps = {
  cursor?: boolean
  content?: TooltipProps<any, any>['content']
}

export function ChartTooltip({ cursor, content }: ChartTooltipProps) {
  return <Tooltip cursor={cursor} content={content} />
}

type ChartTooltipContentProps = {
  labelFormatter?: (value: string) => string
  indicator?: "dot" | "line"
}

export function ChartTooltipContent({
  labelFormatter,
  indicator,
}: ChartTooltipContentProps) {
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <p className="text-sm font-medium">
            {labelFormatter ? labelFormatter("") : ""}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">
            {indicator === "dot" ? "•" : "—"}
          </p>
        </div>
      </div>
    </div>
  )
}

type ChartLegendProps = {
  content?: React.ReactNode
}

export function ChartLegend({ content }: ChartLegendProps) {
  return <Legend content={content as any} />
}

type ChartLegendContentProps = {
  payload?: any[]
}

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  if (!payload) return null
  return (
    <div className="flex items-center gap-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
} 