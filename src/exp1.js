import * as d3 from 'd3';

function app() {
	let data = []
	d3.csv('data.csv').then(d => {
		data = d.slice(0, 1000)
		console.log(data)
	})

	document.getElementById('overall-button').onclick = function () {
		let circles = d3.select('svg')
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
			.attr('cx', d => Number(d.Age))
			.attr('cy', d => 200 - d.Overall)
	}

	document.getElementById('potential-button').onclick = function () {
		let circles = d3.select('svg')
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
			.attr('cx', d => Number(d.Age))
			.attr('cy', d => 200 - d.Potential)
	}
}

export {
	app
}