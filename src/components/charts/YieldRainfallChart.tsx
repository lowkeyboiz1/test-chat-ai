import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"

const YieldRainfallChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["Năng suất", "Lượng mưa"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
        },
        yAxis: [
          {
            type: "value",
            name: "Năng suất (tấn/ha)",
            min: 0,
            max: 10,
            position: "left",
          },
          {
            type: "value",
            name: "Lượng mưa (mm)",
            min: 0,
            max: 300,
            position: "right",
          },
        ],
        series: [
          {
            name: "Năng suất",
            type: "bar",
            data: [4.2, 4.5, 5.0, 5.2, 5.5, 6.0, 6.2, 6.5, 6.8, 7.0, 7.2, 7.5],
          },
          {
            name: "Lượng mưa",
            type: "line",
            yAxisIndex: 1,
            data: [20, 40, 60, 80, 120, 180, 220, 240, 200, 160, 80, 40],
          },
        ],
      }
      chart.setOption(option)
      const handleResize = () => {
        chart.resize()
      }
      window.addEventListener("resize", handleResize)
      return () => {
        chart.dispose()
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return <div ref={chartRef} className="h-44 w-full"></div>
}

export default YieldRainfallChart
