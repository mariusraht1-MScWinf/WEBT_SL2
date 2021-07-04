class PopulationDensity {
  static createChart(data, onresize = false) {
    d3.selectAll("#population_density > *").remove();
    let svg = d3.select("#population_density"),
      width = document.getElementById("population_density").parentElement.clientWidth - 20,
      height = width, // make it square
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    svg.attr("width", width).attr("height", height);

    if (!onresize) {
      window.addEventListener("resize", function () {
        let svg = d3.select("#population_density");
        let w = svg.node().parentElement.clientWidth - 20;
        svg.attr("width", w).attr("height", w);
        PopulationDensity.createChart(data, true);
      });
    }

    let color = d3.scaleOrdinal(data.map((d) => d.color));

    // Generate the pie
    let pie = d3.pie();

    // Generate the arcs
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    //Generate groups
    let arcs = g
      .selectAll("arc")
      .data(pie(data.map((d) => d.value)))
      .enter()
      .append("g")
      .attr("class", "arc")
      .on("mouseover", function () {
        PieChart.onMouseover(svg, this);
      })
      .on("mouseout", function () {
        PieChart.onMouseout(svg, this);
      });

    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);

    arcs
      .append("svg:text")
      .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
      .attr("text-anchor", "middle")
      .append("tspan")
      .attr("fill", "white")
      .attr("font-size", ".9em")
      .attr("font-weight", "bold")
      .text((d, i) => data[i].label);

    arcs
      .selectAll("text")
      .append("tspan")
      .attr("class", "text")
      .attr("fill", "white")
      .attr("font-size", ".9em")
      .attr("x", "0")
      .attr("dy", "1.2em")
      .text((d, i) => d3.format(",")(d.value));

    App.showLoader("loader_population_density", false);
  }

  static showData() {
    let dataset = [];
    let color = ["#e2bed3", "#22c1c3", "#fcb045", "#e6d358", "#7ee3b1", "#e6fc46", "#fc6446", "#8c9ade", "#fc466b"];
    Countries.getData().then((json) => {
      // recursive function to load country data completely before creating the pie chart
      function getCountryData(json) {
        if (json.length == 0) {
          // termination condition: no country left to load, so draw chart
          PopulationDensity.createChart(dataset);
        } else {
          // while countries left
          let item = json.pop(); // get next country and remove it from array
          // call API and call getCountryData recursively in promise
          fetch(`https://l1n.de/tl2/public/country/${item.code}/population_density`)
            .then((response) => response.json())
            .then((data) => {
              dataset.push({ value: data, color: color.pop(), label: item.country });
              getCountryData(json);
            });
        }
      }
      getCountryData(json);
    });
  }
}
