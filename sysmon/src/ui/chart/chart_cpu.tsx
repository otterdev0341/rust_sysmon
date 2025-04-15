import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { useCpuUsed } from "../../context/cpu_used_context";

const CpuUsedChart = () => {
  const { cpuUsedDeque } = useCpuUsed();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const dequeData = cpuUsedDeque.getAll(); // newest last
    const MAX_POINTS = 100;
    const INTERVAL = 2000; // 2 seconds

    if (dequeData.length === 0) return;

    const now = Date.now();
    const timestamps = Array.from({ length: MAX_POINTS }, (_, i) =>
      new Date(now - (MAX_POINTS - i - 1) * INTERVAL)
    );

    const numCores = dequeData[0].data.length;

    // Pad the beginning with zero-usage data if needed
    const paddedData = Array.from({ length: MAX_POINTS }, (_, i) => {
      const actualIndex = i - (MAX_POINTS - dequeData.length);
      if (actualIndex < 0) {
        return {
          data: Array.from({ length: numCores }, (_, coreId) => ({
            cpu_core: coreId, // Include cpu_core here for padding
            cpu_used_percent: 0, // Default zero usage
          })),
        };
      }
      return dequeData[actualIndex];
    });

    // Corrected data transformation
    const coreLines = Array.from({ length: numCores }, (_, coreId) => ({
      core: coreId,
      values: paddedData.map((entry, i) => {
        const match = entry.data.find(d => d.cpu_core === coreId);
        return {
          time: timestamps[i],
          usage: match?.cpu_used_percent ?? 0,
        };
      }),
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 350;
    const margin = { top: 20, right: 150, bottom: 80, left: 50 }; // Increased bottom margin

    const x = d3
      .scaleTime()
      .domain([timestamps[0], timestamps[timestamps.length - 1]])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ time: Date; usage: number }>()
      .x(d => x(d.time))
      .y(d => y(d.usage));

    const color = d3
      .scaleOrdinal<number, string>()
      .domain(coreLines.map(d => d.core))
      .range(d3.schemeCategory10);

    svg
      .attr("viewBox", `0 0 ${width} ${height + margin.bottom}`) // Adjust viewBox to include space for the legend (if needed)
      .attr("width", width)
      .attr("height", height + margin.bottom); // Ensure the SVG height accommodates the legend (if needed)

    svg
      .selectAll(".cpu-line")
      .data(coreLines)
      .join("path")
      .attr("class", "cpu-line")
      .attr("fill", "none")
      .attr("stroke", d => color(d.core))
      .attr("stroke-width", 2)
      .attr("d", d => line(d.values));

    // X-Axis (Hidden)
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(0)); // Hide X-Axis ticks

    // Y-Axis (Visible)
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

  }, [cpuUsedDeque]);

  return <svg ref={svgRef} className="w-full h-full mx-5 mt-3" />;
};

export default CpuUsedChart;
