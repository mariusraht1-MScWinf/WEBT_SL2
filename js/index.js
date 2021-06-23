VaccinationsOverTime.fillCountriesSelect();
GdpPerCapital.test();

let svg = d3.select("#vaccinations_over_time"),
  margin = { top: 20, right: 20, bottom: 40, left: 90 },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

svg.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

let xScale = d3.scaleBand().range([0, width]).padding(0.4),
  yScale = d3.scaleLinear().range([height, 0]);

let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/test_vaccinations_over_time.json").then((data) => {
  xScale.domain(data.map((d) => d.date));
  yScale.domain([0, d3.max(data, (d) => d.value1)]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", width / 2 + 24)
    .attr("y", margin.bottom)
    .attr("text-anchor", "end")
    .attr("fill", "black")
    .attr("font-size", "14px")
    .text("Datum");

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => `$ ${d}`)
        .ticks(10)
    )
    .append("text")
    .attr("transform", "rotate(90)")
    .attr("y", 50)
    .attr("x", height / 2 + 2 * margin.top + margin.bottom)
    .attr("fill", "black")
    .attr("font-size", "14px")
    .text("Impfungen (kummuliert)");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => yScale(d.value1))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value1));
});
