import React, { useState } from "react";
import RetirementForm from "./RetirementForm";

function RetirementComparison() {
  const [scenario1, setScenario1] = useState({
    currentAge: 25,
    retirementAge: 30,
    annualIncome: 10000,
    annualSavings: 35,
    currentSavings: 5500,
    incomeIncrease: 2,
    incomeRequired: 45,
    retirementYears: "",
    tableData: [],
    chartData: {},
  });

  const [scenario2, setScenario2] = useState({
    currentAge: 35,
    retirementAge: 35,
    annualIncome: 12000,
    annualSavings: 30,
    currentSavings: 7500,
    incomeIncrease: 3,
    incomeRequired: 50,
    retirementYears: "",
    tableData: [],
    chartData: {},
  });

  const [showSecondForm, setShowSecondForm] = useState(false);

  const handleScenario1Submit = (e) => {
    e.preventDefault();
    console.log("Scenario 1 submitted");
  };

  const handleScenario2Submit = (e) => {
    e.preventDefault();
    console.log("Scenario 2 submitted");
  };

  const handleShowSecondForm = () => {
    setShowSecondForm(!showSecondForm);
  };
  const handleScenario1Change = (event) => {
    const { name, value } = event.target;
    setScenario1((prevScenario) => ({
      ...prevScenario,
      [name]: value,
    }));
  };

  const handleScenario2Change = (event) => {
    const { name, value } = event.target;
    setScenario2((prevScenario) => ({
      ...prevScenario,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <nav>
        <button onClick={handleShowSecondForm}>
          {showSecondForm ? "Hide Second Form" : "Show Second Form"}
        </button>
      </nav>
      <h1> Retirement Calculator Comparison </h1>
      <div className="flex">
        <RetirementForm
          values={scenario1}
          onSubmit={handleScenario1Submit}
          onChange={handleScenario1Change}
        />

        {showSecondForm && (
          <RetirementForm
            values={scenario2}
            onSubmit={handleScenario2Submit}
            onChange={handleScenario2Change}
          />
        )}
      </div>
    </div>
  );
}

export default RetirementComparison;
