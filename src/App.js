import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setMapCountries(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  const onCountryChange = async (e) =>{
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      if (countryCode === 'worldwide') {
        setMapCenter([0, 0]);
        setMapZoom(3);
      } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      }
      
    });
  } 
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>COVID-19 Tracker</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}

        </Select>
      </FormControl>
      </div>

      <div className="app__stats">
          <InfoBox 
          isRed
          active={casesType === 'cases'}
          onClick={e => setCasesType('cases')}
          title="Corona Virus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
          <InfoBox 
          active={casesType === 'recovered'}
          onClick={e => setCasesType('recovered')}
          title="Recovered Cases" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
          <InfoBox 
          isRed
          active={casesType === 'deaths'}
          onClick={e => setCasesType('deaths')}
          title="Death Cases" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>


          
      </div>
      <Map 
      casestypes={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />
      </div>
      <Card className="app__right">
            <CardContent>
              <h3>Live Cases by country</h3>
              <Table countries={tableData} />
              <h3 className="app__graphTitle">Worldwide {casesType}</h3>
              <LineGraph className="app__graph" casesTypes={casesType}/>
            </CardContent>
      </Card>
      
    </div>
  );
}

export default App;