import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { LandPlot } from "@/types"

interface LandDistributionChartProps {
  landPlots: LandPlot[]
}

const LandDistributionChart: React.FC<LandDistributionChartProps> = ({ landPlots }) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)

      // Tính toán phân bổ diện tích theo thửa đất
      const plotAreas = landPlots.map((plot) => {
        const areaValue = parseFloat(plot.area.split(" ")[0])
        return {
          value: areaValue,
          name: plot.name,
          cropType: plot.crops[0]?.name || "Chưa trồng",
        }
      })

      const option = {
        animation: false,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ha ({d}%)<br/>Cây trồng: {c2}",
        },
        legend: {
          top: "5%",
          left: "center",
          textStyle: {
            fontSize: 10,
          },
        },
        series: [
          {
            name: "Phân bổ thửa đất",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: plotAreas.map((item) => ({
              value: item.value,
              name: `${item.name} (${item.cropType})`,
              c2: item.cropType,
            })),
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
  }, [landPlots])

  return <div ref={chartRef} className="h-44 w-full"></div>
}

export default LandDistributionChart
