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

 /* static createTable(data) {
    let table = document.getElementById("vaccination_table");
    table.querySelectorAll("td:not(:first-child), th:not(:first-child)").forEach((x) => x.remove());
    data.forEach(function (item, index) {
      let t = document.createElement("th");
      t.innerHTML = item.date;
      table.querySelector("thead tr").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = item.people_fully_vaccinated  == undefined ? 0 : item.people_fully_vaccinated; // in case the intervall is set to 1
      table.querySelector("tbody tr:first-child").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = item.new_vaccinations  == undefined ? "unknown" : item.new_vaccinations; // in case the intervall is set to 1
      table.querySelector("tbody tr:nth-child(2)").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = item.total_vaccinations;
      table.querySelector("tbody tr:last-child").appendChild(t);
    });
  } */

  static createTable(data) {
    let table = document.getElementById("vaccination_table");
    table.querySelectorAll("td:not(:first-child), th:not(:first-child)").forEach((x) => x.remove());
    d3.formatDefaultLocale({
      "decimal": ",",
      "grouping": [3],
      "thousands": ".",
      "currency": "€"
    })
    data.forEach(function (item, index) {
      let t = document.createElement("th");
      t.innerHTML = item.date;
      table.querySelector("thead tr").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = d3.format(",")(item.people_fully_vaccinated)//item.people_fully_vaccinated  == undefined ? 0 : item.people_fully_vaccinated; // in case the intervall is set to 1
      table.querySelector("tbody tr:first-child").appendChild(t);
      t = document.createElement("td");
      t.innerHTML = d3.format(",")(item.new_vaccinations)//  == undefined ? "unknown" : item.new_vaccinations; // in case the intervall is set to 1
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
            for (var prop in item) { // go over each property in item 
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

  static showData (code) {
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((data) => { 
        console.log(data)
        data.forEach(function(item,index){
          console.log(item.date +" "+item.people_fully_vaccinated)
        })
        let aggregateddata = []
        d3.group(data, d => d.date.toString().substring(0,7)).forEach(function (item,index){
          let month = item[0].date.toString().substring(0,7)
          aggregateddata.push({
            'date': month,
            'new_vaccinations': d3.sum(item, d => d.new_vaccinations),
            'people_fully_vaccinated': d3.max(item, d => d.people_fully_vaccinated),
            'total_vaccinations': d3.max(item, d => d.total_vaccinations)
          })
        })
        VaccinationsOverTime.createChart(aggregateddata);
        VaccinationsOverTime.createTable(aggregateddata);
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
