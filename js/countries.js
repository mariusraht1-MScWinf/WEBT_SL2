class Countries {
  data = [];

  static getData() {
    return fetch("data/countries.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
  }
}
