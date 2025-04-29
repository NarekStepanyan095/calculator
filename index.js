function handleClick() {
    const inputElement = document.getElementById("field");
    const inputValue = inputElement.value;

    const finalResult = executeExpression(inputValue);

    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `<h1>The Result is: ${finalResult}</h1>`;
    inputElement.value = "";
};

function primitiveCalc(num1, operator, num2) {
    switch (operator) {
        case "+": return Number(num1) + Number(num2);
        case "-": return Number(num1) - Number(num2);
        case "*": return Number(num1) * Number(num2);
        default: return Number(num1) / Number(num2);
    };
};

function calculateChainOfOperations(operationString) {
    const mathOperators = ["/", "*", "-", "+"];

    let num1;
    let num2;
    let operationStringCopy = operationString;

    while (mathOperators.length) {
        while (operationStringCopy.indexOf(mathOperators[0]) !== -1) {
            if (!isNaN(operationStringCopy)) { break };

            const currentOperator = mathOperators[0];

            let currentOperatorIndex = operationStringCopy.indexOf(currentOperator);
            let slicedString = operationStringCopy;

            for (let i = currentOperatorIndex - 1; i >= 0; i--) {
                if (currentOperator !== "-") {
                    if (isNaN(operationStringCopy[i]) && isNaN(operationStringCopy[i - 1])) {
                        num1 = operationStringCopy.slice(i, currentOperatorIndex);
                        slicedString = slicedString.slice(i);
                        break;
                    }
                    if (isNaN(operationStringCopy[i]) && !isNaN(operationStringCopy[i - 1])) {
                        num1 = operationStringCopy.slice(i + 1, currentOperatorIndex);
                        slicedString = slicedString.slice(i + 1);
                        break;
                    }
                    if (i === 0) {
                        num1 = operationStringCopy.slice(0, currentOperatorIndex);
                        break;
                    }
                }
            }

            if (currentOperator === "-") {
                for (let i = 1; i < operationStringCopy.length; i++) {
                    if (operationStringCopy[i] === "-") {
                        for (let j = i - 1; j--; j >= 0) {
                            if (isNaN(operationStringCopy[j])) {
                                num1 = operationStringCopy.slice(j + 1, i);
                                break;
                            }
                            if (j === 0) {
                                num1 = operationStringCopy.slice(0, i);
                            }
                        }

                        slicedString = slicedString.slice(i + 1);

                        for (let i = 1; i <= slicedString.length; i++) {
                            if (slicedString[i] === "-" || slicedString[i] === undefined || slicedString[i] === "+") {
                                num2 = slicedString.slice(0, i)
                                slicedString = num1 + "-" + num2;
                                break;
                            }
                        };
                        break;
                    }
                }
            }

            if (currentOperator !== "-") {
                for (let i = currentOperatorIndex + 2; i <= operationStringCopy.length; i++) {

                    if (i === operationStringCopy.length) {
                        num2 = operationStringCopy.slice(currentOperatorIndex + 1);
                        break;
                    }
                    if (isNaN(operationStringCopy[i])) {
                        num2 = operationStringCopy.slice(currentOperatorIndex + 1, i);
                        slicedString = num1 + currentOperator + num2;
                        break;
                    }
                }
            };

            const result = primitiveCalc(num1, currentOperator, num2);

            operationStringCopy = operationStringCopy.replaceAll(slicedString, result);
            operationStringCopy = operationStringCopy.replaceAll("+-", "-");
        };

        mathOperators.shift();
    }

    return operationStringCopy;
}

function getNestedExpression(expression) {
    let expressionCopy = expression;

    const firstIndexOfCloseBracket = expressionCopy.indexOf(")");
    expressionCopy = expressionCopy.slice(0, firstIndexOfCloseBracket);

    const lastIndexOfOpenBracket = expressionCopy.lastIndexOf("(");
    expressionCopy = expressionCopy.slice(lastIndexOfOpenBracket + 1);

    return expressionCopy;
};

function executeExpression(expression) {
    let expressionCopy = expression;
    let resultOfCalculation;

    if (expressionCopy.indexOf("(") !== -1) {
        const nestedExpression = getNestedExpression(expressionCopy);
        resultOfCalculation = calculateChainOfOperations(nestedExpression);

        expressionCopy = expressionCopy.replaceAll(`(${nestedExpression})`, resultOfCalculation);

        return executeExpression(expressionCopy);
    };

    if (expressionCopy.indexOf("(") === -1) {
        resultOfCalculation = calculateChainOfOperations(expressionCopy);

        return resultOfCalculation;
    };
};





