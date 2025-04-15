import { useEffect, useRef } from "react"
import * as d3 from "d3"

type RamPieProps = {
  used_ram: number
  free_ram: number
}

const RamPieChart = ({ used_ram, free_ram }: RamPieProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const data = [
      { name: "Used", value: used_ram },
      { name: "Free", value: free_ram }
    ]

    const width = 100
    const height = 100
    const radius = Math.min(width, height) / 2 - 10

    const color = d3.scaleOrdinal<string>()
      .domain(["Used", "Free"])
      .range(["#e74c3c", "#2ecc71"]) // red, green

    const pie = d3.pie<{ name: string, value: number }>()
      .value(d => d.value)

    const arc = d3.arc<d3.PieArcDatum<{ name: string, value: number }>>()
      .innerRadius(0)
      .outerRadius(radius)

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    svg.selectAll("*").remove() // clear before drawing

    const chart = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    chart.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name) as string)
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
  }, [used_ram, free_ram])

  return <svg ref={svgRef}></svg>
}

export default RamPieChart
