
  function showLoader(id, show = false) {
    switch (show) {
      case true:
        document.querySelector("#"+id).classList.remove("d-none");
        break;
      case false:
        document.querySelector("#"+id).classList.add("d-none");
        break;
    }
  }

showLoader("loader_vaccinations_over_time", true);
showLoader("loader_gdp_per_capita", true);
showLoader("loader_population_density", true);
setTimeout (function(){
    VaccinationsOverTime.fillCountriesSelect();
    PopulationDensity.showData();
    GdpPerCapita.showData();
}, 1000 + Math.random()*2000);


