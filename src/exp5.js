import * as d3 from 'd3';

function showTooltip(evt, d) {
	document.getElementById('tooltip').style.display = 'block'
	document.getElementById('tooltip').style.left = evt.pageX + 2 + 'px'
	document.getElementById('tooltip').style.top = evt.pageY + 2 + 'px'
	document.getElementById('tooltip').innerHTML = `
		<div>
			Name: ${d.Name}<br>
			Age: ${d.Age}<br>
			Overall: ${d.Overall}<br>
			Potential: ${d.Potential}
		</div>
	`
}

function hideTooltip(d, i, n) {
	document.getElementById('tooltip').style.display = 'none'
}

function drawAxis(xScale, yScale) {
	let leftAxisG = d3.select('svg').append('g')
		.attr('id', 'left-axis')
		.attr('transform', 'translate(30, 30)')
	let bottomAxisG = d3.select('svg').append('g')
		.attr('id', 'bottom-axis')
		.attr('transform', 'translate(30, 270)')

	let bottomAxis = d3.axisBottom(xScale)
	bottomAxisG.call(bottomAxis)

	let leftAxis = d3.axisLeft(yScale)
	leftAxisG.call(leftAxis)
}

function render(data, config) {
	if (config.filter) {
		data = data.filter(d => d.Nationality === config.filter)
	}

	let circles = config.canvas
		.selectAll('circle')
		.data(data, (d => d.ID))

	let enteringCircles = circles
		.enter()
		.append('circle')
		.attr('r', 5)
		.attr('fill', 'red')
		.attr('cx', d => config.xScale(Number(d[config.x])))
		.attr('cy', 240)
		.on('mouseover', showTooltip)
		.on('mouseout', hideTooltip)

	circles.exit()
		.transition()
		.duration(1000)
		.ease(d3.easeCubic)
		.attr('cy', 0)
		.attr('opacity', 0)
		.remove()

	circles.merge(enteringCircles)
		.transition()
		.duration(1000)
		.ease(d3.easeCubic)
		.attr('cy', d => config.yScale(Number(d[config.y])))
		.attr('opacity', 0.5)
}

async function app() {
	let data = []
	await d3.csv('data.csv').then(d => {
		data = d.slice(0, 1000)
		console.log(data)
	})

	let xScale = d3.scaleLinear()
		.domain([
			d3.min(data, d => Number(d.Age)),
			d3.max(data, d => Number(d.Age))
		])
		.range([0, 540])

	let yScale = d3.scaleLinear()
		.domain([
			d3.min(data, d => Number(d.Overall)),
			d3.max(data, d => Number(d.Overall))
		])
		.range([240, 0])

	drawAxis(xScale, yScale)

	let circleCanvas = d3.select('svg').append('g')
		.attr('id', 'circles')
		.attr('transform', 'translate(30, 30)')

	let config = {
		canvas: circleCanvas,
		x: 'Age',
		y: 'Overall',
		xScale: xScale,
		yScale: yScale,
		filter: undefined,
	}
	render(data, config)

	document.getElementById('overall-button').onclick = function () {
		config.y = 'Overall'
		render(data, config)
	}

	document.getElementById('potential-button').onclick = function () {
		config.y = 'Potential'
		render(data, config)
	}

	document.getElementById('spain-button').onclick = function () {
		config.filter = 'Spain'
		render(data, config)
	}

	document.getElementById('germany-button').onclick = function () {
		config.filter = 'Germany'
		render(data, config)
	}

	document.getElementById('italy-button').onclick = function () {
		config.filter = 'Italy'
		render(data, config)
	}

	document.getElementById('england-button').onclick = function () {
		config.filter = 'England'
		render(data, config)
	}

	document.getElementById('portugal-button').onclick = function () {
		config.filter = 'Portugal'
		render(data, config)
	}

	document.getElementById('filter-none-button').onclick = function () {
		config.filter = undefined
		render(data, config)
	}
}

export {
	app
}