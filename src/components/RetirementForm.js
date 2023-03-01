import React, { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function RetirementForm() {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(40);
  let [annualIncome, setAnnualIncome] = useState(10000);
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
    let prevYearEndingBalance = currentSavings;

    for (
      let year = currentAge;
      year < retirementAge + parseInt(retirementYears);
      year++
    ) {
      const savingBalance = Number(balance);
      // if (year === currentAge) {
      //   let investmentGrowth = savingBalance * 0.07; // Assuming 7% investment growth
      // } else {
      // }9

      if (year < retirementAge - 1) {
        var investmentGrowth = savingBalance * 0.07; // Assuming 7% investment growth
      } else if (year - 1 > retirementAge - 3) {
        investmentGrowth = savingBalance * 0.04; // Assuming 7% investment growth
      }

      for (
        let year = currentAge;
        year <= retirementAge + parseInt(retirementYears);
        year++
      )
        if (year === currentAge) {
          var contributions = incomeIncrease;
        }

      if (year === currentAge) {
        var contributions = (annualSavings / 100) * annualIncome;
      } else if (year < retirementAge - 1) {
        annualIncome = annualIncome + (incomeIncrease / 100) * annualIncome;
        contributions = (annualSavings / 100) * annualIncome;
      } else {
        contributions = 0;
      }

      let retireWithdrawals = 0;
      if (year < retirementAge - 1) {
        // retireWithdrawals = (annualIncome * (incomeRequired / 100)) / 12;
        retireWithdrawals = 0;
      } else {
        retireWithdrawals = (annualIncome * (incomeRequired / 100)) / 12;
        balance = balance - retireWithdrawals;
        if (balance < 0) {
          balance = 0;
        }
      }

      // Update balance with previous year's ending balance
      balance =
        prevYearEndingBalance +
        investmentGrowth +
        contributions -
        retireWithdrawals;

      yearData.push({
        age: year + 1,
        savingBalance: savingBalance.toFixed(0),
        retirementBalance:
          prevYearEndingBalance >= 0
            ? Number(prevYearEndingBalance).toFixed(0)
            : "N/A",
        investmentGrowth: investmentGrowth.toFixed(0),
        contributions: contributions.toFixed(0),
        retireWithdrawals:
          prevYearEndingBalance >= 0 ? retireWithdrawals.toFixed(0) : "N/A",
        endingBalance: balance >= 0 ? balance.toFixed(0) : "N/A",
      });

      // Update prevYearEndingBalance with the ending balance of the current year
      prevYearEndingBalance = balance;
    }

    // Update the table data state
    setTableData(yearData);

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

    // Destroy the previous chart instance before rendering the new chart
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
                <th>Contributions at {annualSavings} of Income</th>
                <th>Retire with ${incomeRequired} of Income Withdrawals</th>
                <th>Ending Retirement Balance</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, index) => (
                <tr key={index}>
                  <td>{rowData.age}</td>
                  <td>{rowData.savingBalance}</td>
                  <td>{rowData.investmentGrowth}</td>
                  <td>{rowData.contributions}</td>
                  <td>{rowData.retireWithdrawals}</td>
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
