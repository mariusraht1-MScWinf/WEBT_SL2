class VaccinationsOverTime {
  static fillCountriesSelect() {
    return fetch("data/countries.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)))
      .then((json) => {
        console.log(json);
        d3.select("#countries")
          .selectAll("option")
          .data(json)
          .enter()
          .append("option")
          .text((d) => d.country);
      });
  }

  static create_chart() {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // create svg element, respecting margins
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add X axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 20)
      .text("Datum");

    // Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 4)
      .text("Impfungen (kummuliert)");
  }
}
