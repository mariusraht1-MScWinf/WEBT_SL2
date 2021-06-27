class Countries {
  data = [];

  static getData() {
    return fetch("data/countries.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
  }

  static onChangeSelectCountries(selectedItem) {
    let code = selectedItem.selectedOptions[0].dataset.code;
    VaccinationsOverTime.showData(code);
  }
}