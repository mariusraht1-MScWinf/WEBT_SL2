class GdpPerCapita {
    static svg;
    static groupKey = "date";
      
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
      });
    } 
    static showData(code) {
        fetch(`https://l1n.de/tl2/public/country/${code}/gdp_per_capita`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            GdpPerCapita.create_chart(data);
          });
      }
    
      static onChangeSelectCountries(selectedItem) {
        let code = selectedItem.selectedOptions[0].dataset.code;
        GdpPerCapita.showData(code);
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
      
    

                          
              
                  
                   