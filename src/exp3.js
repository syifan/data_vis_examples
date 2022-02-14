import * as d3 from 'd3';

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


	d3.select('svg').append('g')
		.attr('id', 'circles')
		.attr('transform', 'translate(30, 30)')
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

	document.getElementById('overall-button').onclick = function () {
		let circles = d3.select('svg').select('#circles')
			.selectAll('circle')
			.data(data)

		let enteringCircles = circles
			.enter()
			.append('circle')

		circles = circles.merge(enteringCircles)
			.transition()
			.duration(1000)
			.ease(d3.easeCubic)
			.attr('r', 5)
			.attr('fill', 'red')
			.attr('cx', d => xScale(Number(d.Age)))
			.attr('cy', d => yScale(Number(d.Overall)))
	}

	document.getElementById('potential-button').onclick = function () {
		let circles = d3.select('svg').select('#circles')
			.selectAll('circle')
			.data(data)

		let enteringCircles = circles
			.enter()
			.append('circle')

		circles = circles.merge(enteringCircles)
			.transition()
			.duration(1000)
			.ease(d3.easeCubic)
			.attr('r', 5)
			.attr('fill', 'red')
			.attr('cx', d => xScale(Number(d.Age)))
			.attr('cy', d => yScale(Number(d.Potential)))
	}
}

export {
	app
}