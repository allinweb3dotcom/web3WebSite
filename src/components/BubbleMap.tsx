import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

interface MarketData {
  priceChange24hPercent: number;
  network: string;
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  marketCap: number;
  price: number;
  unixTime: number;
}

interface BubbleMapProps {
  selectedNetwork: string;
}

const BubbleMap: React.FC<BubbleMapProps> = ({ selectedNetwork }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (network: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://multichain-api.birdeye.so/cex/top_market?time_frame=24h&network=${network}`,
        {
          headers: {
            'Origin': 'https://www.birdeye.so',
            'Referer': 'https://www.birdeye.so/?chain=',
            'Agent-Id': '1'
          },
        }
      );

      // Ensure we're working with plain objects
      const cleanData = response.data.data.map((item: any) => ({
        priceChange24hPercent: Number(item.priceChange24hPercent),
        network: String(item.network),
        address: String(item.address),
        symbol: String(item.symbol),
        name: String(item.name),
        logoURI: String(item.logoURI),
        marketCap: Number(item.marketCap),
        price: Number(item.price),
        unixTime: Number(item.unixTime),
      }));

      setData(cleanData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedNetwork);
  }, [selectedNetwork]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 600;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    const bubble = d3.pack().size([width, height]).padding(2);

    // Create a simple hierarchical structure
    const hierarchyData = {
      children: data.map((d) => ({
        ...d,
        value: d.marketCap,
      })),
    };

    const root = d3.hierarchy(hierarchyData).sum((d) => (d as any).value);

    const nodes = bubble(root).descendants().slice(1);

    // Create color scale based on price change
    const colorScale = d3
      .scaleLinear<string>()
      .domain([-10, 0, 10])
      .range(['#ff4d4d', '#666666', '#4dff4d'])
      .clamp(true);

    // Create size scale for bubbles
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.marketCap) || 0])
      .range([10, 80]);

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node
      .append('circle')
      .attr('r', (d) => sizeScale((d.data as any).marketCap))
      .style('fill', (d) => colorScale((d.data as any).priceChange24hPercent))
      .style('opacity', 0.8)
      .on('mouseover', (event, d) => {
        const tooltipContent = document.createElement('div');
        tooltipContent.className = 'flex flex-col gap-1 p-2';
        tooltipContent.innerHTML = `
          <div class="font-bold">${(d.data as any).name} (${(
          d.data as any
        ).symbol.toUpperCase()})</div>
          <div>Market Cap: $${((d.data as any).marketCap / 1e9).toFixed(
            2
          )}B</div>
          <div>Price: $${(d.data as any).price.toFixed(2)}</div>
          <div>24h Change: ${(d.data as any).priceChange24hPercent.toFixed(
            2
          )}%</div>
        `;

        if (tooltipRef.current) {
          tooltipRef.current.innerHTML = '';
          tooltipRef.current.appendChild(tooltipContent);
          tooltipRef.current.style.visibility = 'visible';
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY - 10}px`;
        }
      })
      .on('mousemove', (event) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY - 10}px`;
        }
      })
      .on('mouseout', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.visibility = 'hidden';
        }
      });

    node
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', (d) => {
        const size = sizeScale((d.data as any).marketCap);
        return `${Math.min(size / 3, 14)}px`;
      })
      .text((d) => (d.data as any).symbol.toUpperCase());
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
      <svg ref={svgRef} className="w-full"></svg>
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none"
        style={{
          visibility: 'hidden',
          position: 'fixed',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      />
    </div>
  );
};

export default BubbleMap;
