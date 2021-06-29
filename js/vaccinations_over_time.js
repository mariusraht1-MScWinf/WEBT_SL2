class VaccinationsOverTime {
  static svg;
  static groupKey = "date";
  static keys;
  static x;
  static y;
  static margin = { top: 20, right: 20, bottom: 40, left: 90 };
  static width = 860 - this.margin.left - this.margin.right;
  static height = 600 - this.margin.top - this.margin.bottom;

  static fillCountriesSelect() {
    Countries.getData().then((json) => {
      console.log(json);

      json.forEach((entry) => {
        let option = document.createElement("option");
        option.text = entry.country;
        option.dataset.code = entry.code;
        document.querySelector("#countries").append(option);
      });

      d3.select("#countries").selectAll("option").data(json);

      document.querySelector("#countries").options[0].selected = true;
      document.querySelector("#countries").dispatchEvent(new Event("change"));
    });
  }

  static createChart(data) {
    d3.select("#vaccinations_over_time > *").remove();

    let svg = d3.select("#vaccinations_over_time"),
      margin = { top: 20, right: 20, bottom: 40, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    svg.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

    let xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.4)
      .domain(data.map((d) => d.date));

    let yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.total_vaccinations)]);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
      .call(d3.axisLeft(yScale).ticks(10))
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", 80)
      .attr("x", height / 2 + 2 * margin.top + margin.bottom)
      .attr("fill", "black")
      .attr("font-size", "14px")
      .text("Impfungen (kummuliert)");

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.total_vaccinations))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.total_vaccinations))
      .attr("fill", "green");

    VaccinationsOverTime.showLoader(false);
  }

  static createTable(code) {
    let table = document.getElementById("vaccination_table")
    table.querySelectorAll("td:not(:first-child), th:not(:first-child)").forEach(x => x.remove());
    code.forEach(function (item, index){
      let t = document.createElement("th")
      t.innerHTML = item.date
      table.querySelector("thead tr").appendChild(t)
      t = document.createElement("td")
      t.innerHTML = item.people_fully_vaccinated == undefined? 0:item.people_fully_vaccinated
      table.querySelector("tbody tr:first-child").appendChild(t)
      t = document.createElement("td")
      t.innerHTML = item.new_vaccinations==undefined? item.total_vaccinations:item.new_vaccinations
      table.querySelector("tbody tr:nth-child(2)").appendChild(t)
      t = document.createElement("td")
      t.innerHTML = item.total_vaccinations
      table.querySelector("tbody tr:last-child").appendChild(t)
    }) 
  }

  static showData(code) {
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        VaccinationsOverTime.createChart(data);
        VaccinationsOverTime.createTable(data);
      });
  }

  static showLoader(show = false) {
    switch (show) {
      case true:
        document.querySelector("#loader_vaccinations_over_time").classList.remove("d-none");
        document.querySelector("#loader_vaccinations_over_time").classList.add("d-inline");
        break;
      case false:
        document.querySelector("#loader_vaccinations_over_time").classList.add("d-none");
        break;
    }
  }
}
