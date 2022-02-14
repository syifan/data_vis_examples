import * as d3 from 'd3';

let data = []


let config = {
	data: undefined,
	canvas: undefined,
	x: 'Age',
	y: 'Overall',
	xScale: undefined,
	yScale: undefined,
	filter: undefined,
}

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

function hideTooltip() {
	document.getElementById('tooltip').style.display = 'none'
}

function drawAxis() {
	let leftAxisG = d3.select('svg').select('#left-axis')
	let bottomAxisG = d3.select('svg').select('#bottom-axis')

	let bottomAxis = d3.axisBottom(config.xScale)
	bottomAxisG.call(bottomAxis)

	let leftAxis = d3.axisLeft(config.yScale)
	leftAxisG.call(leftAxis)
}

function render() {
	data = config.data
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
		.attr('cx', d => config.xScale(Number(d[config.x])))
		.attr('cy', d => config.yScale(Number(d[config.y])))
		.attr('opacity', 0.5)
}

function registerButtonEvents() {
	document.getElementById('overall-button').onclick = function () {
		config.y = 'Overall'
		render()
	}

	document.getElementById('potential-button').onclick = function () {
		config.y = 'Potential'
		render()
	}

	document.getElementById('spain-button').onclick = function () {
		config.filter = 'Spain'
		render()
	}

	document.getElementById('germany-button').onclick = function () {
		config.filter = 'Germany'
		render()
	}

	document.getElementById('italy-button').onclick = function () {
		config.filter = 'Italy'
		render()
	}

	document.getElementById('england-button').onclick = function () {
		config.filter = 'England'
		render()
	}

	document.getElementById('portugal-button').onclick = function () {
		config.filter = 'Portugal'
		render()
	}

	document.getElementById('filter-none-button').onclick = function () {
		config.filter = undefined
		render()
	}
}

function createScales() {
	console.log(config.xMin, config.xMax, config.yMin, config.yMax)
	let xScale = d3.scaleLinear()
		.domain([config.xMin, config.xMax])
		.range([0, 540])
	config.xScale = xScale

	let yScale = d3.scaleLinear()
		.domain([config.yMin, config.yMax])
		.range([240, 0])
	config.yScale = yScale
}

function prepareGroups() {
	let circleCanvas = d3.select('svg').append('g')
		.attr('id', 'circles')
		.attr('transform', 'translate(30, 30)')
	config.canvas = circleCanvas

	let leftAxisG = d3.select('svg').append('g')
		.attr('id', 'left-axis')
		.attr('transform', 'translate(30, 30)')
	config.leftAxisG = leftAxisG

	let bottomAxisG = d3.select('svg').append('g')
		.attr('id', 'bottom-axis')
		.attr('transform', 'translate(30, 270)')
	config.bottomAxisG = bottomAxisG
}

async function loadData() {
	return d3.csv('data.csv').then(d => {
		data = d.slice(0, 1000)
		config.data = data

		config.xMin = d3.min(data, d => Number(d.Age))
		config.xMax = d3.max(data, d => Number(d.Age))
		config.yMin = d3.min(data, d => Number(d.Potential))
		config.yMax = d3.max(data, d => Number(d.Potential))

		console.log(data)
	})
}

function registerDraggingEvents() {
	d3.select('svg').on('mousedown', function (evt) {
		config.dragging = true
		config.draggingStartX = evt.pageX
		config.draggingStartY = evt.pageY
		config.draggingStartMinX = config.xMin
		config.draggingStartMaxX = config.xMax
		config.draggingStartMinY = config.yMin
		config.draggingStartMaxY = config.yMax
		console.log('dragging', config.draggingStartX, config.draggingStartY)
	})

	d3.select('svg').on('mousemove', function (evt) {
		if (config.dragging) {
			let mouseX = evt.pageX;
			let mouseY = evt.pageY;
			let mouseDeltaX = mouseX - config.draggingStartX;
			let mouseDeltaY = mouseY - config.draggingStartY;

			let deltaX = config.xScale.invert(mouseDeltaX) -
				config.xScale.invert(0);
			let deltaY = config.yScale.invert(mouseDeltaY) -
				config.yScale.invert(0);

			console.log('dragging', mouseDeltaX, mouseDeltaY, deltaX, deltaY);

			config.xMin = config.draggingStartMinX - deltaX;
			config.xMax = config.draggingStartMaxX - deltaX;
			config.yMin = config.draggingStartMinY - deltaY;
			config.yMax = config.draggingStartMaxY - deltaY;

			createScales()
			drawAxis()
			render()
		}
	});

	d3.select('svg').on('mouseup', function () {
		config.dragging = false
		console.log('not dragging')
	})
}

async function app() {
	await loadData()
	prepareGroups()

	createScales()
	drawAxis()

	registerButtonEvents()
	registerDraggingEvents()

	render()
}

export {
	app
}