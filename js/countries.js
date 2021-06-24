class Countries {
  data = [];

  static getData() {
    return fetch("data/countries.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
  }
}

class GdpPerCapita {
  data = [];

  static getData() {
    return fetch("data/GdpPerCapita.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
  }
}