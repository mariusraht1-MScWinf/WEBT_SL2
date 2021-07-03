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

  static createChart(data, onresize = false) {
    d3.selectAll("#vaccinations_over_time > *").remove();

    let groupedData = [];
    data.forEach((d) => {
      groupedData.push({
        key: new Date(d.date),
        values: [
          { name: "first", value: d.people_fully_vaccinated },
          { name: "complete", value: d.new_vaccinations },
        ],
      });
    });

    let margin = { top: 20, right: 20, bottom: 50, left: 80 };
    let w = document.getElementById("vaccinations_over_time").parentElement.clientWidth;
    let width = w - margin.left - margin.right,
      height = w / 2 - margin.top - margin.bottom;

    let x0 = d3.scaleBand().rangeRound([0, width], 0.5);
    let x1 = d3.scaleBand();
    let y = d3.scaleLinear().rangeRound([height, 0]);

    let xAxis = d3
      .axisBottom()
      .scale(x0)
      .tickFormat(d3.timeFormat("%-m/%Y"))
      .tickValues(groupedData.map((d) => d.key));

    let yAxis = d3.axisLeft().scale(y);
    if (!onresize) {
      window.addEventListener("resize", function () {
        let w = document.getElementById("vaccinations_over_time").parentElement.clientWidth - 20;
        let svg = d3.select("#vaccinations_over_time");
        svg.attr("width", w).attr("height", w);
        VaccinationsOverTime.createChart(data, true);
      });
    }

    const color = d3.scaleOrdinal(["lightblue", "lightgreen"]);

    let svg = d3
      .select("#vaccinations_over_time")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let fullyVaccinated = groupedData.map((d) => d.key);
    let newVaccinated = groupedData[0].values.map((gd) => gd.name);

    x0.domain(fullyVaccinated);
    x1.domain(newVaccinated).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(groupedData, (key) => d3.max(key.values, (gd) => gd.value))]);

    // X-Achse
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("dx", width / 2)
      .attr("dy", 34)
      .attr("fill", "black")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Datum");

    // Y-Achse
    svg
      .append("g")
      .attr("class", "y axis")
      .style("opacity", "0")
      .call(yAxis)
      .append("text")
      .attr("y", height / 2 - margin.left + margin.right)
      .attr("x", (width + margin.top + margin.bottom) / 3)
      .attr("transform", "rotate(90)")
      .attr("fill", "black")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Impfungen (kummuliert)");

    svg.select(".y").style("opacity", "1");

    let slice = svg
      .selectAll(".slice")
      .data(groupedData)
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform", (d) => "translate(" + x0(d.key) + ",0)");

    slice
      .selectAll("rect")
      .data((d) => d.values)
      .enter()
      .append("rect")
      .attr("width", x1.bandwidth())
      .style("fill", (gd) => color(gd.name))
      .attr("x", (gd) => x1(gd.name))
      .attr("y", (gd) => y(0))
      .attr("height", (gd) => height - y(0));

    slice
      .selectAll("rect")
      .attr("y", (gd) => y(gd.value))
      .attr("height", (gd) => height - y(gd.value));

    showLoader("loader_vaccinations_over_time", false);
  }

  static createTable(data) {
    let table = document.getElementById("vaccination_table");
    table.querySelectorAll("td:not(:first-child), th:not(:first-child)").forEach((x) => x.remove());

    data.forEach(function (item, index) {
      let t = document.createElement("th");
      t.innerHTML = item.date;
      table.querySelector("thead tr").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = d3.format(",")(item.people_fully_vaccinated); //item.people_fully_vaccinated  == undefined ? 0 : item.people_fully_vaccinated; // in case the intervall is set to 1
      table.querySelector("tbody tr:first-child").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = d3.format(",")(item.new_vaccinations); //  == undefined ? "unknown" : item.new_vaccinations; // in case the intervall is set to 1
      table.querySelector("tbody tr:nth-child(2)").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = d3.format(",")(item.total_vaccinations);
      table.querySelector("tbody tr:last-child").appendChild(t);
    });
  }

  /*
  static showData(code) {
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let aggregateddata = []; // new Object for pre aggregation
        let record;  // copy of item 
        let intervall = 1; // Days for counting 
        data[0].new_vaccinations = data[0].people_vaccinated; // set the starting point because new vaccination is missing in first record and it doesnt start with 0
        data.forEach(function (item, index) { //iteration over each item in data, index represents nth item
          if (index % (intervall) == 0) {  // start new record if intervall is met 
            if(index>0) { // push new record if record was created before 
              aggregateddata.push(record);
            }
            if (item["new_vaccinations"]==undefined) {
              item["new_vaccinations"] = item.total_vaccinations-data[index-1].total_vaccinations; // correction of wrong data 
            }
            record = Object.assign({}, item); //start new record, copy of item 
          }
          else { //if intervall is not met, sum up items in record 
            if ((index+1) % (intervall) == 0 || data.length == (index+1)) { // Save the last date 
              record.date = item.date; 
              record.total_vaccinations = item.total_vaccinations; // set the last value since those numbers are already accummulated
            }
            if (item["new_vaccinations"]==undefined) {
              item["new_vaccinations"] = item.total_vaccinations-data[index-1].total_vaccinations; // correction of wrong data 
            }
            for (let prop in item) { // go over each property in item 
              if (prop != "date" && prop!= "total_vaccinations") { //dates shall not be saved 
                if (record[prop]==undefined){ // sometimes item has less properties, add property if missing 
                  record[prop] = item[prop];
                }
                else {
                  record[prop]+=item[prop]; //sum up property 
                }
              }

            }
          }

            if(data.length == (index+1)) // Call of last iteration
              {
                aggregateddata.push(record);
              }
          
        });
        console.log(aggregateddata);
        VaccinationsOverTime.createChart(aggregateddata);
        VaccinationsOverTime.createTable(aggregateddata);
      });
  }*/

  static showData(code) {
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let aggregatedData = [];
        d3.group(data, (d) => d.date.toString().substring(0, 7)).forEach(function (item, index) {
          let month = item[0].date.toString().substring(0, 7);
          aggregatedData.push({
            date: month,
            new_vaccinations: d3.sum(item, (d) => d.new_vaccinations),
            people_fully_vaccinated: d3.max(item, (d) => d.people_fully_vaccinated),
            total_vaccinations: d3.max(item, (d) => d.total_vaccinations),
          });
        });
        VaccinationsOverTime.createChart(aggregatedData);
        VaccinationsOverTime.createTable(aggregatedData);
      });
  }
}
