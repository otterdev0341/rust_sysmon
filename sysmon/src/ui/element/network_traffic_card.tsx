import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { useNetworkTraffic } from "../../context/network_traffic_context";

export const NetworkTrafficCard = () => {
  const { trafficDeque } = useNetworkTraffic();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const dequeData = trafficDeque.getAll();
    const MAX_POINTS = 100;
    const INTERVAL = 2000;

    if (dequeData.length === 0) return;

    const now = Date.now();
    const timestamps = Array.from({ length: MAX_POINTS }, (_, i) =>
      new Date(now - (MAX_POINTS - i - 1) * INTERVAL)
    );

    const interfaceNames = dequeData[0].data.map((i) => i.name);

    const paddedData = Array.from({ length: MAX_POINTS }, (_, i) => {
      const actualIndex = i - (MAX_POINTS - dequeData.length);
      if (actualIndex < 0) {
        return {
          data: interfaceNames.map((name) => ({
            name,
            rx_bytes: 0,
            tx_bytes: 0,
          })),
        };
      }
      return dequeData[actualIndex];
    });

    const lines = interfaceNames.flatMap((name) => {
      const baseColor = d3.schemeCategory10[interfaceNames.indexOf(name) % 10];
      return [
        {
          name: `${name} RX`,
          interface: name,
          direction: "RX",
          color: baseColor,
          dasharray: "0",
          values: paddedData.map((entry, i) => ({
            time: timestamps[i],
            bytes: entry.data.find((d) => d.name === name)?.rx_bytes ?? 0,
          })),
        },
        {
          name: `${name} TX`,
          interface: name,
          direction: "TX",
          color: baseColor,
          dasharray: "4,2", // dashed for TX
          values: paddedData.map((entry, i) => ({
            time: timestamps[i],
            bytes: entry.data.find((d) => d.name === name)?.tx_bytes ?? 0,
          })),
        },
      ];
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 400;
    const margin = { top: 20, right: 100, bottom: 80, left: 0 };

    const x = d3
      .scaleTime()
      .domain([timestamps[0], timestamps[timestamps.length - 1]])
      .range([margin.left, width - margin.right]);

    const maxBytes = d3.max(lines.flatMap((l) => l.values.map((v) => v.bytes))) ?? 1;

    const y = d3
      .scaleLinear()
      .domain([0, maxBytes])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ time: Date; bytes: number }>()
      .x((d) => x(d.time))
      .y((d) => y(d.bytes));

    svg
      .attr("viewBox", `0 0 ${width} ${height + margin.bottom}`)
      .attr("width", width)
      .attr("height", height + margin.bottom);

    // Draw lines
    svg
      .selectAll(".net-line")
      .data(lines)
      .join("path")
      .attr("class", "net-line")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => d.dasharray)
      .attr("d", (d) => line(d.values));

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y).ticks(5).tickFormat((d) => formatBytes(Number(d)) + "/s")
      );

    // Labels at the end of each line
    svg
      .selectAll(".line-label")
      .data(lines)
      .join("text")
      .attr("x", width - margin.right + 5)
      .attr("y", (d) => {
        const last = d.values[d.values.length - 1];
        return y(last.bytes);
      })
      .attr("fill", (d) => d.color)
      .text(
        (d) =>
          `${d.interface} ${d.direction}: ${formatBytes(
            d.values[d.values.length - 1].bytes
          )}/s`
      )
      .style("font-size", "15px");

    // Helper: format bytes to KB/s, MB/s, etc
    function formatBytes(bytes: number): string {
      if (bytes < 1024) return `${bytes} B`;
      const units = ["KB", "MB", "GB"];
      let unit = -1;
      do {
        bytes /= 1024;
        unit++;
      } while (bytes >= 1024 && unit < units.length - 1);
      return `${bytes.toFixed(1)} ${units[unit]}`;
    }
  }, [trafficDeque]);

  return <svg ref={svgRef} className="w-full h-full mx-5 mt-3" />;
};
