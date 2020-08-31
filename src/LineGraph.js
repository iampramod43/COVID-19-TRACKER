import React, { useState, useEffect } from 'react';
import './LineGraph.css';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const options = {
    legend: {
        display: false,
    },
    elements: {
        points: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};
const buildChartData = (data, casesTypes = 'cases') => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint= {
                x: date,
                y: data[casesTypes][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesTypes][date];
    };
    return chartData;
}
function LineGraph({casesTypes = "cases", ...props}) {

    const [data, setData] = useState({});


    


    useEffect(() => {
        const fetchData = async () => {
           await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((Response) => Response.json())
            .then(data => {
            let chartData = buildChartData(data, casesTypes);
            setData(chartData);
        });
        }
        fetchData();
    }, [casesTypes]);

    

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                 <Line 
                 options={options}
                 data={{
                     datasets: [{
                         backgroundColor: "rgba(204, 16, 52, 0.5)",
                         borderColor: "#cc1034",
                         data: data
                     }]
                 }}
                 />
            )}
           
        </div>
    )
}

export default LineGraph
