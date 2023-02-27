import React, { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function RetirementForm() {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(10000);
  const [annualSavings, setAnnualSavings] = useState(35);
  const [currentSavings, setCurrentSavings] = useState(5500);
  const [incomeIncrease, setIncomeIncrease] = useState(2);
  const [incomeRequired, setIncomeRequired] = useState(45);
  const [retirementYears, setRetirementYears] = useState("");
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Calculate the table data
    let balance = currentSavings;
    let yearData = [];
    for (
      let year = currentAge;
      year <= retirementAge + parseInt(retirementYears);
      year++
    ) {
      const beginningBalance = Number(balance);
      const investmentGrowth = beginningBalance * 0.06; // Assuming 6% investment growth
      const contributions = annualIncome * (annualSavings / 100);
      let retireWithdrawals = 0;
      if (year <= retirementAge) {
        retireWithdrawals = (annualIncome * (incomeRequired / 100)) / 12;
        balance = balance + retireWithdrawals;
      } else {
        retireWithdrawals = (annualIncome * (incomeRequired / 100)) / 12;
        balance = balance - retireWithdrawals;
        if (balance < 0) {
          balance = 0;
        }
      }
      yearData.push({
        age: year,
        beginningBalance: beginningBalance.toFixed(2),
        retirementBalance: balance >= 0 ? balance.toFixed(2) : "N/A",
        investmentGrowth: investmentGrowth.toFixed(2),
        contributions: contributions.toFixed(2),
        retireWithdrawals: balance >= 0 ? retireWithdrawals.toFixed(2) : "N/A",
        endingBalance: balance >= 0 ? balance.toFixed(2) : "N/A",
      });
    }
    // Update the table data state
    setTableData(yearData);

    //chartdata

    // Create the chart data
    const chartLabels = yearData.map((rowData) => rowData.age);
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: "Ending Retirement Balance",
          data: yearData.map((rowData) => rowData.endingBalance),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    if (chartRef.current) {
      chartRef.current.chartInstance.destroy();
    }
    // Render the chart
    chartRef.current = <Line data={chartData} />;

    setChartData(chartData);
  };

  return (
    <>
      <div className="container">
        <h1> Retirement Calculator </h1>
        <form onSubmit={handleFormSubmit}>
          <div className="flex">
            <label>
              Current age:
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </label>
            <label>
              Age of retirement:
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
              />
            </label>
          </div>
          <div className="flex">
            <label>
              Annual household income:
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
              />
            </label>
          </div>
          <label>
            Annual retirement savings (%):
            <input
              type="number"
              value={annualSavings}
              onChange={(e) => setAnnualSavings(e.target.value)}
            />
          </label>

          <label>
            Current retirement savings:
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
            />
          </label>

          <label>
            Expected income increase (%):
            <input
              type="number"
              value={incomeIncrease}
              onChange={(e) => setIncomeIncrease(e.target.value)}
            />
          </label>

          <label>
            Income required at retirement (%):
            <input
              type="number"
              value={incomeRequired}
              onChange={(e) => setIncomeRequired(e.target.value)}
            />
          </label>

          <label>
            Years of retirement income:
            <input
              type="number"
              value={retirementYears}
              onChange={(e) => setRetirementYears(e.target.value)}
            />
          </label>

          <button type="submit">Calculate</button>
        </form>
        {tableData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>Beginning Retirement Balance</th>
                <th>Investment Growth</th>
                {/* <th>Contributions at {annualSavings} of Income</th>
              <th>Retire with ${incomeRequired} of Income Withdrawals</th> */}
                <th>Ending Retirement Balance</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, index) => (
                <tr key={index}>
                  <td>{rowData.age}</td>
                  <td>{rowData.beginningBalance}</td>
                  <td>{rowData.investmentGrowth}</td>
                  {/* <td>{rowData.contributions}</td>
                <td>{rowData.retireWithdrawals}</td> */}
                  <td>{rowData.endingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {chartRef.current}
      </div>
    </>
  );
}

export default RetirementForm;
