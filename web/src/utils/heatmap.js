import * as d3 from 'd3'

const createHeatmap = (wrapperId, 
  { xlabels, ylabels, data },
  calcColorFn,
  breakStringFn
  ) => {
    // Const variables
    const cellSize = 17
    const interCellMargin = 1
    const cellStartingPoint = 35
    const labelFontsize = 13
    const margin = { top: 20, right: 50, bottom: 20, left: 50 }

    // Compute values
    const svgWidth = cellSize * (xlabels.length + 2*interCellMargin)
    const svgHeight = cellSize * (ylabels.length + 2*interCellMargin)

    // Clear svg
    d3.select(wrapperId).selectAll('svg').remove()
    d3.select(wrapperId).select('.tooltip').remove()

    // Create svg element
    const svg = d3.select(wrapperId)
      .append('svg')
        .attr('width', svgWidth + margin.left + margin.right)
        .attr('height', svgHeight + margin.top + margin.bottom)
      .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")")

    // Create tooltip
    const tooltip = d3.select(wrapperId)
      .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', '#00000057')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '4px')
        .style('padding', '3px')
    
    // Function for tooltip event
    const tooltipMouseOver = () => {
      tooltip.style('opacity', 1)
      d3.select(this)
        .style('stroke', 'black')
        .style('opacity', 1)
    }

    const tooltipMouseMove = (event) => {
      let pointer = d3.pointer(event)
      tooltip.html('Verbs : ' + event.target.attributes['data-verbs'].value)
        .style('left', pointer[0] + 'px')
        .style('top', pointer[1] + 'px')
    }

    const tooltipMouseLeave = () => {
      tooltip.style('opacity', 0)
      d3.select(this)
        .style('stroke', 'none')
        .style('opacity', 0)
    }

    // Create cells
    data.forEach((rowValue, j) => {
      let yValue = j*cellSize + 1*interCellMargin

      let row = svg.append('g')
        .attr('class', 'row')
        .attr('x', 1)
        .attr('y', yValue)

      let label = breakStringFn(ylabels[j])
      row.append('text')
        .attr('class', 'ylabel')
        .attr('x', -20 - label.length)
        .attr('y', yValue + labelFontsize)
        .attr('font-weight', '400')
        .attr('font-size', labelFontsize)
        .text(label)
        .enter()
    
      row.selectAll('.cell')
        .data(rowValue)
          .enter()
        .append('rect')
          .attr('class', 'cell')
          .attr('x', (d, i) => cellStartingPoint + i * cellSize + 1*interCellMargin)
          .attr('y', yValue)
          .attr('data-verbs', d => d == undefined ? JSON.stringify('[]') : JSON.stringify(d))
          .attr('data-xlabel', (d, i) => xlabels[i])
          .attr('data-ylabel', ylabels[j])
          .attr('width', cellSize - 1*interCellMargin)
          .attr('height', cellSize - 1*interCellMargin)
          .attr('fill', d => calcColorFn(d))
        .on('mouseover', tooltipMouseOver)
        .on('mousemove', tooltipMouseMove)
        .on('mouseleave', tooltipMouseLeave)
    })
  }

export { createHeatmap }