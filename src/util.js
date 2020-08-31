import {Circle, Popup} from "react-leaflet";
import numeral from "numeral";
import React from 'react'

const casesTypesColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
};

export const showDataOnMap = (data, casestypes = "cases") => 
    data.map((country) => (
        <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypesColors[casestypes].hex}
        fillColor={casesTypesColors[casestypes].hex}
        radius={Math.sqrt(country[casestypes]) * casesTypesColors[casestypes].multiplier}
        >

        <Popup >
            <div className="info-container">
                <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}></div>
                <div className="info-name">{country.country}</div>
                <div className="info-cases">Cases: {numeral(country.cases).format("0.0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0.0")}</div>
                <div className="info-deaths">Deaths: {numeral(country.deaths).format("0.0")}</div>
            </div>
        </Popup>
        </Circle>
        
    ));


    export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format("0.0a")}` : "+0"