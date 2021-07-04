class App {
  static init() {
    d3.formatDefaultLocale({
      decimal: ",",
      grouping: [3],
      thousands: ".",
      currency: "€",
    });

    App.showLoader("loader_vaccinations_over_time", true);
    App.showLoader("loader_gdp_per_capita", true);
    App.showLoader("loader_population_density", true);
    setTimeout(() => {
      VaccinationsOverTime.fillCountriesSelect();
      PopulationDensity.showData();
      GdpPerCapita.showData();
    }, 1000 + Math.random() * 2000);
  }

  static showLoader(id, show = false) {
    switch (show) {
      case true:
        document.querySelector("#" + id).classList.remove("d-none");
        break;
      case false:
        document.querySelector("#" + id).classList.add("d-none");
        break;
    }
  }

  static showError(id, show = false) {
    switch (show) {
      case true:
        document.querySelector("#" + id + " img").src = "img/error.svg";
        document.querySelector("#" + id + " img").style.width = "24px";
        document.querySelectorAll("#" + id + " span")[0].textContent = "Fehler: ";
        document.querySelectorAll("#" + id + " span")[1].textContent = "Daten konnten nicht geladen werden.";
        break;
      case false:
        document.querySelector("#" + id + " img").src = "img/loader.gif";
        document.querySelector("#" + id + " img").style.width = "32px";
        document.querySelectorAll("#" + id + " span")[0].textContent = "";
        document.querySelectorAll("#" + id + " span")[1].textContent = "";
        break;
    }
  }
}
