    // Dynamiczne wyświetlanie pól PPK
    const ppkRadios = document.getElementsByName('ppk');
    const ppkFields = document.getElementById('ppk-fields');
    ppkRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        ppkFields.style.display = (radio.value === 'tak' && radio.checked) ? 'block' : 'none';
      });
    });
    
    // Dynamiczne wyświetlanie pola PIT-2 w zależności od wyboru ulgi26
    const ulga26Radios = document.getElementsByName('ulga26');
    const pit2Container = document.getElementById('pit2-container');
    ulga26Radios.forEach(radio => {
      radio.addEventListener('change', () => {
        pit2Container.style.display = (radio.value === 'nie' && radio.checked) ? 'block' : 'none';
      });
    });
    
    // Dynamiczne wyświetlanie pól nadgodzin
    const uwzglednijNadgodzinyRadios = document.getElementsByName('uwzglednijNadgodziny');
    const nadgodzinyContainer = document.getElementById('nadgodziny-container');
    uwzglednijNadgodzinyRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        nadgodzinyContainer.style.display = (radio.value === 'tak' && radio.checked) ? 'block' : 'none';
      });
    });
    
    const nadgodzinyRadios = document.getElementsByName('nadgodziny');
    const regularneField = document.getElementById('nadgodziny-regularne');
    const nieregularneField = document.getElementById('nadgodziny-nieregularne');
    nadgodzinyRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'regularne' && radio.checked) {
          regularneField.style.display = 'block';
          nieregularneField.style.display = 'none';
        } else if (radio.value === 'nieregularne' && radio.checked) {
          regularneField.style.display = 'none';
          nieregularneField.style.display = 'block';
        }
      });
    });
    
    // Dynamiczne wyświetlanie pól transportu
    const uwzglednijTransportRadios = document.getElementsByName('uwzglednijTransport');
    const transportContainer = document.getElementById('transport-container');
    const odlegloscField = document.getElementById('odleglosc');
    const kosztKmField = document.getElementById('koszt-km');
    uwzglednijTransportRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'tak' && radio.checked) {
          transportContainer.style.display = 'block';
          odlegloscField.setAttribute('required', 'required');
          kosztKmField.setAttribute('required', 'required');
        } else {
          transportContainer.style.display = 'none';
          odlegloscField.removeAttribute('required');
          kosztKmField.removeAttribute('required');
        }
      });
    });
    
    // Obsługa submit formularza i wyświetlanie wyników kalkulacji (przykładowe wartości)
    document.getElementById("calculator-form").addEventListener("submit", function(event) {
      event.preventDefault();
      
      // Pokaż sekcję wyników
      document.getElementById("results").style.display = "block";

      // Przewinięcie do wyników
      document.getElementById("results").scrollIntoView({ behavior: 'smooth' });

      const grossSalary = parseFloat(document.getElementById("brutto").value); // Wartość brutto z formularza

      // Koszt uzyskania przychodu
      const miejscePracy = document.getElementsByName('miejscePracy');
      let kosztUzyskania;
      if (miejscePracy[0].checked) {
        kosztUzyskania = 250;
      } else {
        kosztUzyskania = 300;
      }

      // PPK
      const ppkRadios = document.getElementsByName('ppk');
      let ppkEmployee;
      if (ppkRadios[0].checked) {
        ppkEmployee = parseFloat(document.getElementById('ppk-employee').value) / 100;
      } else {
        ppkEmployee = 0;
      }
      let ppkEmployer;
      if (ppkRadios[0].checked) {
        ppkEmployer = parseFloat(document.getElementById('ppk-employer').value) / 100;
      } else {
        ppkEmployer = 0;
      }
      const ppkEmployerContribution = grossSalary * ppkEmployer;
      const ppkEmployeeContribution = grossSalary * ppkEmployee;
      

      // PIT-2
      const ulga26Radios = document.getElementsByName('ulga26');
      const pit2Radios = document.getElementById('pit2');
      let pit2;
      if (ulga26Radios[1].checked) {
        pit2 = parseFloat(pit2Radios.value);
      } else {
        pit2 = 0;
      }
      
      
      //const grossSalary = parseFloat(document.getElementById("brutto").value); // Wartość brutto z formularza
      const grossSalaryHourly = grossSalary / 160; // Stawka godzinowa brutto
      const pensionInsurance = grossSalary * 0.0976; // Składka emerytalna
      const disabilityInsurance = grossSalary * 0.015; // Składka rentowa
      const sicknessInsurance = grossSalary * 0.0245; // Składka chorobowa
      const healthInsuranceBase = grossSalary - pensionInsurance - disabilityInsurance - sicknessInsurance; // Podstawa do obliczenia składki zdrowotnej
      const healthInsurance = healthInsuranceBase * 0.09; // Składka zdrowotna
      const healthInsurancePercent = healthInsurance / grossSalary * 100; // Procent składki zdrowotnej
      const pitBase = healthInsuranceBase - kosztUzyskania + ppkEmployerContribution; // Podstawa do obliczenia PIT
      let pitContribution;
      if (ulga26Radios[1].checked) {
        pitContribution = 0.12;
      } else {
        pitContribution = 0;
      }
      const pitAdvance = (pitBase * pitContribution).toFixed(0) - pit2; // Zaliczka na PIT
      const pitAdvancePercent = pitAdvance / grossSalary * 100; // Procent zaliczki na PIT
      const netSalary = grossSalary - pensionInsurance - disabilityInsurance - sicknessInsurance - healthInsurance - pitAdvance - ppkEmployeeContribution; // Wynagrodzenie netto
      const netSalaryHourly = netSalary / 160; // Stawka godzinowa netto
      const netSalaryPercent = netSalary / grossSalary * 100; // Procent wynagrodzenia netto    

      // Wynagrodzenie brutto
      document.getElementById("gross-salary").querySelector("span").textContent = grossSalary.toFixed(2) + " PLN";
      document.getElementById("gross-hourly-rate").querySelector("span").textContent = grossSalaryHourly.toFixed(2) + " PLN/h";
      
      // Składki i zaliczki
      document.getElementById("pension-insurance").querySelector("span").textContent = pensionInsurance.toFixed(2) + " PLN (9,76%)";
      document.getElementById("disability-insurance").querySelector("span").textContent = disabilityInsurance.toFixed(2) + " PLN (1,50%)";
      document.getElementById("sickness-insurance").querySelector("span").textContent = sicknessInsurance.toFixed(2) + " PLN (2,45%)";
      document.getElementById("health-insurance").querySelector("span").textContent = healthInsurance.toFixed(2) + " PLN (" + healthInsurancePercent.toFixed(2) + "%)";
      document.getElementById("pit-advance").querySelector("span").textContent = pitAdvance.toFixed(2) + " PLN (" + pitAdvancePercent.toFixed(2) + "%)";
      // Jeśli korzystamy z PPK, pokaż i ustaw również pole Składka PPK
      if (document.querySelector('input[name="ppk"]:checked').value === "tak") {
        document.getElementById("ppk-result").style.display = "block";
        document.getElementById("ppk-contribution").querySelector("span").textContent = ppkEmployeeContribution.toFixed(2) + " PLN (" + (ppkEmployee * 100).toFixed(2) + "%)";
      } else {
        document.getElementById("ppk-result").style.display = "none";
      }
      
      // Grupa 2: Wynagrodzenie netto i stawka godzinowa netto
      document.getElementById("net-salary").querySelector("span").textContent = netSalary.toFixed(2) + " PLN ";
      document.getElementById("net-hourly-rate").querySelector("span").textContent = netSalaryHourly.toFixed(2) + " PLN/h";
      document.getElementById("net-gross").querySelector("span").textContent = netSalaryPercent.toFixed(2) + "%";

      let czasDojazdu;
  let transportCost;
  if (document.querySelector('input[name="uwzglednijTransport"]:checked').value === "tak") {
    czasDojazdu = parseFloat(document.getElementById("czas-dojazdu").value);
    const odleglosc = parseFloat(document.getElementById("odleglosc").value);
    const kosztKm = parseFloat(document.getElementById("koszt-km").value);
    transportCost = odleglosc * kosztKm * 2 * 20; // Koszt dojazdów w ciągu miesiąca
  } else {
    czasDojazdu = 0;
    transportCost = 0;
  }
  
  const transportTime = czasDojazdu * 2 * 20 / 60; // Czas dojazdu w ciągu miesiąca
      

      //const grossSalary = parseFloat(document.getElementById("brutto").value); // Wartość brutto z formularza

      // Obliczanie nadgodzin i dodanie ich do czasu pracy
      const uwzglednijNadgodziny = document.querySelector('input[name="uwzglednijNadgodziny"]:checked').value;
      let nadgodziny;
      if (uwzglednijNadgodziny === "tak") {
        const nadgodzinyRadios = document.getElementsByName('nadgodziny');
        const regularneField = document.getElementById('nadgodziny-regularne');
        const nieregularneField = document.getElementById('nadgodziny-nieregularne');
        if (nadgodzinyRadios[0].checked) {
          nadgodziny = parseFloat(regularneField.querySelector('select').value) * 20;
        } else {
          nadgodziny = parseFloat(nieregularneField.querySelector('select').value);
        }
      } else {
        nadgodziny = 0;
      }
      const realWorkTime = 160 + transportTime + nadgodziny; // Realny czas pracy w ciągu miesiąca

      const realNetSalary = netSalary - transportCost; // Realne wynagrodzenie netto
      const realNetHourlyRate = realNetSalary / realWorkTime; // Realna stawka godzinowa netto
      const realNetPercent = realNetSalary / netSalary * 100; // Procent realnego wynagrodzenia netto
      const realGrossPercent = realNetSalary / grossSalary * 100; // Procent realnego wynagrodzenia brutto

      // Grupa 1: Realne wynagrodzenie netto i realna stawka godzinowa netto
      document.getElementById("real-net-salary").querySelector("span").textContent = realNetSalary.toFixed(2) + " PLN";
      document.getElementById("real-net-hourly-rate").querySelector("span").textContent = realNetHourlyRate.toFixed(2) + " PLN/h";
      document.getElementById("real-net-net").querySelector("span").textContent = realNetPercent.toFixed(2) + "%";
      document.getElementById("real-net-gross").querySelector("span").textContent = realGrossPercent.toFixed(2) + "%";
      document.getElementById("real-work-time").querySelector("span").textContent = realWorkTime.toFixed(1) + " h";
      if (document.querySelector('input[name="uwzglednijTransport"]:checked').value === "tak") {
        document.getElementById("real-transport").style.display = "block";
        document.getElementById("real-transport").querySelector("span").textContent = transportCost.toFixed(2) + " PLN";
      } else {
        document.getElementById("real-transport").style.display = "none";
      }
    });