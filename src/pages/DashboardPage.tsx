import { Button, Stack, Switch, Typography } from '@mui/material'
import type { Layout, ResponsiveLayouts } from 'react-grid-layout'
import { ResponsiveGridLayout, useContainerWidth, verticalCompactor } from 'react-grid-layout'
import type { ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { DriversGridWidget } from '../features/dashboard/widgets/DriversGridWidget'
import { KpiWidget } from '../features/dashboard/widgets/KpiWidget'
import { QuickDispatchWidget } from '../features/dashboard/widgets/QuickDispatchWidget'
import { TripsChartWidget } from '../features/dashboard/widgets/TripsChartWidget'
import { WidgetFrame } from '../features/dashboard/widgets/WidgetFrame'

type WidgetKey = 'kpis' | 'trips' | 'dispatch' | 'drivers'

const storageKey = 'fleet.dashboard.layouts'

const defaultLayouts: ResponsiveLayouts = {
  lg: [
    { i: 'kpis', x: 0, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'trips', x: 4, y: 0, w: 8, h: 6, minW: 4, minH: 4 },
    { i: 'dispatch', x: 0, y: 6, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'drivers', x: 4, y: 6, w: 8, h: 8, minW: 6, minH: 6 },
  ],
  md: [
    { i: 'kpis', x: 0, y: 0, w: 5, h: 6, minW: 4, minH: 4 },
    { i: 'trips', x: 5, y: 0, w: 7, h: 6, minW: 5, minH: 4 },
    { i: 'dispatch', x: 0, y: 6, w: 5, h: 6, minW: 4, minH: 4 },
    { i: 'drivers', x: 0, y: 12, w: 12, h: 8, minW: 8, minH: 6 },
  ],
  sm: [
    { i: 'kpis', x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
    { i: 'trips', x: 0, y: 6, w: 6, h: 6, minW: 4, minH: 4 },
    { i: 'dispatch', x: 0, y: 12, w: 6, h: 6, minW: 4, minH: 4 },
    { i: 'drivers', x: 0, y: 18, w: 6, h: 9, minW: 4, minH: 6 },
  ],
  xs: [
    { i: 'kpis', x: 0, y: 0, w: 4, h: 6, minW: 4, minH: 4 },
    { i: 'trips', x: 0, y: 6, w: 4, h: 6, minW: 4, minH: 4 },
    { i: 'dispatch', x: 0, y: 12, w: 4, h: 6, minW: 4, minH: 4 },
    { i: 'drivers', x: 0, y: 18, w: 4, h: 10, minW: 4, minH: 6 },
  ],
}

function loadLayouts(): ResponsiveLayouts {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return defaultLayouts
    const parsed = JSON.parse(raw) as ResponsiveLayouts
    return parsed
  } catch {
    return defaultLayouts
  }
}

function saveLayouts(layouts: ResponsiveLayouts) {
  localStorage.setItem(storageKey, JSON.stringify(layouts))
}

export function DashboardPage() {
  const { width, mounted, containerRef } = useContainerWidth({ measureBeforeMount: true })
  const [editLayout, setEditLayout] = useState(false)
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => loadLayouts())

  const onLayoutChange = useCallback(
    (_current: Layout, all: ResponsiveLayouts) => {
      setLayouts(all)
      saveLayouts(all)
    },
    [setLayouts],
  )

  const widgets = useMemo(
    () =>
      [
        {
          key: 'kpis',
          title: 'KPIs',
          subtitle: 'Live metrics',
          node: <KpiWidget />,
        },
        {
          key: 'trips',
          title: 'Trips',
          subtitle: 'This week',
          node: <TripsChartWidget />,
        },
        {
          key: 'dispatch',
          title: 'Quick dispatch',
          subtitle: 'Create a job',
          node: <QuickDispatchWidget />,
        },
        {
          key: 'drivers',
          title: 'Drivers',
          subtitle: 'Availability and activity',
          node: <DriversGridWidget />,
        },
      ] as const satisfies ReadonlyArray<{ key: WidgetKey; title: string; subtitle: string; node: ReactElement }>,
    [],
  )

  return (
    <Stack spacing={2} ref={containerRef}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Widgets can be moved/resized. Toggle edit mode to arrange.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            Edit layout
          </Typography>
          <Switch checked={editLayout} onChange={(_, v) => setEditLayout(v)} />
          <Button
            variant="outlined"
            onClick={() => {
              setLayouts(defaultLayouts)
              saveLayouts(defaultLayouts)
            }}
          >
            Reset layout
          </Button>
        </Stack>
      </Stack>

      {mounted ? (
        <ResponsiveGridLayout
          className="layout"
          width={width}
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1200, md: 900, sm: 600, xs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
          rowHeight={56}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          dragConfig={{ enabled: editLayout, handle: '.WidgetHeader', threshold: 3 }}
          resizeConfig={{ enabled: editLayout, handles: ['se'] }}
          compactor={verticalCompactor}
        >
          {widgets.map((w) => (
            <div key={w.key}>
              <WidgetFrame title={w.title} subtitle={w.subtitle}>
                {w.node}
              </WidgetFrame>
            </div>
          ))}
        </ResponsiveGridLayout>
      ) : null}
    </Stack>
  )
}

