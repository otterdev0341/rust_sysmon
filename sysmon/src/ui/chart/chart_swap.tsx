import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { SystemService } from '../../service/system';
import { RamDataDto } from '../../dto/systsm_dto';
import { debounce } from 'lodash';

export const ChartSwap = () => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [ramData, setRamData] = useState<RamDataDto | null>(null);

    //fetch data
    useEffect(() => {
        const service = new SystemService();
        const fetchData = debounce(async () => {
            const result = await service.get_ram_info();
            setRamData(result);
        }, 1000); // Wait 4 seconds before making another request
    
        fetchData(); // Initial call
        // const interval = setInterval(fetchData, 4000); // 4 second interval
    
        // return () => clearInterval(interval); // Cleanup on unmount
    },[]);

    // create graph
    useEffect(() => {
        if (!ramData || !ref.current) return;
    
        const max_swap = ramData.swap_capacity;
        const used_swap = ramData.swap_used;
        const free_ram = max_swap - used_swap;
    
        const data = [
          { label: "Used", value: used_swap },
          { label: "Free", value: free_ram },
        ];
    
        const width = 80;
        const height = 80;
        const radius = Math.min(width, height) / 2 - 10;
    
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // clear old content
    
        const chartGroup = svg
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        const color = d3
          .scaleOrdinal<string>()
          .domain(data.map(d => d.label))
          .range(["#ff7f7f", "#b3e6b3"]);
    
        const pie = d3.pie<any>().value(d => d.value);
    
        const arc = d3.arc<d3.PieArcDatum<any>>()
          .innerRadius(0)
          .outerRadius(radius);
    
        chartGroup.selectAll("path")
          .data(pie(data))
          .enter()
          .append("path")
          .attr("d", arc as any)
          .attr("fill", d => color(d.data.label))
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
    
        // Optional: show percentage labels
        chartGroup.selectAll("text")
          .data(pie(data))
          .enter()
          .append("text")
          .text(d => `${d.data.label}: ${Math.round((d.data.value / max_swap) * 100)}%`)
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .style("text-anchor", "middle")
          .style("font-size", "12px");
    
      }, [ramData]);

    return(
        <div className=''>
            <svg ref={ref}></svg>
        </div>
    )
}