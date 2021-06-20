fetch("data/countries.json")
  .then(response => response.json())
  .then(json => console.log(json));
  
create_chart_vaccinations_over_time();
