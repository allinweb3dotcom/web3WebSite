import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchExchangeReserves } from '../services/exchangeService';
import type { BalanceDetail, ExchangeData } from '../types/api';

interface ExchangeReservesProps {
  selectedExchange: string;
}

const ExchangeReserves: React.FC<ExchangeReservesProps> = ({ selectedExchange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ExchangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchExchangeReserves(selectedExchange);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch exchange reserves data');
        console.error('Error fetching exchange data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExchange]);

  useEffect(() => {
    if (!data.length || !containerRef.current) return;

    const selectedData = data[0];
    if (!selectedData) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 400;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create size scale for bubbles
    const maxValue = d3.max(selectedData.balanceDetails, d => parseFloat(d.balanceUsd)) || 0;
    const sizeScale = d3.scaleSqrt()
      .domain([0, maxValue])
      .range([20, 60]);

    // Initialize nodes with proper spacing
    const simulation = d3.forceSimulation()
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(5))
      .force('collide', d3.forceCollide().radius(d => (d as any).radius + 2).strength(0.5))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Create nodes data
    const nodes = selectedData.balanceDetails.map((d, i) => ({
      id: d.symbol,
      radius: sizeScale(parseFloat(d.balanceUsd)),
      color: colorScale(i.toString()),
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
      data: d
    }));

    // Create node elements
    const nodeElements = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    // Add circles
    nodeElements.append('circle')
      .attr('r', d => d.radius)
      .style('fill', d => d.color)
      .style('opacity', 0.8);

    // Add symbol text
    nodeElements.append('text')
      .text(d => d.data.symbol)
      .attr('text-anchor', 'middle')
      .attr('dy', '0em')
      .style('fill', 'white')
      .style('font-size', d => `${Math.min(d.radius / 3, 14)}px`)
      .style('pointer-events', 'none');

    // Add value text
    nodeElements.append('text')
      .text(d => `$${Number(d.data.balanceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`)
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('fill', 'white')
      .style('font-size', d => `${Math.min(d.radius / 4, 12)}px`)
      .style('pointer-events', 'none');

    // Set up simulation
    simulation.nodes(nodes as any).on('tick', () => {
      nodeElements.attr('transform', (d: any) => {
        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
      <div ref={containerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default ExchangeReserves;