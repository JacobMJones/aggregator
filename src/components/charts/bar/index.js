import React from "react";
import { Bar } from "react-chartjs-2";

const BarGraph = ({ state }) => {
  console.log(state);

  const data = state.startStops.cleaning.map((item, index) => {
    return item[2];
  });

  const labels = state.startStops.cleaning.map((item, index) => {
    return item[0];
  });

  
  const finalData = {
    labels: labels,
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: data
      }

    ]
  };

  return (
    <div>
      <Bar
        data={finalData}
        options={{
          title: {
            display: true,
            text: "Cleaning",
            fontSize: 20
          },
          legend: {
            display: true,
            position: "right"
          }
        }}
      />
    </div>
  );
};

export default BarGraph;
