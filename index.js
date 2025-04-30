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
    let mathOperatorsRegex = /[*\/]/g;
    const allOperatorsRegex = /[*\/+-]/g

    let num1;
    let num2;
    let operationStringCopy = operationString;
    let isFirstNumberNegative = false;

    while (operationStringCopy.search(allOperatorsRegex) !== -1) {
        if (!isNaN(operationStringCopy)) {
            return operationStringCopy;
        }


        if (operationStringCopy.search(mathOperatorsRegex) === -1) {
            mathOperatorsRegex = /[+-]/g;
        }

        if (operationStringCopy[0] === "-" && mathOperatorsRegex.source === "[+-]") {
            operationStringCopy = operationStringCopy.substring(1);
            isFirstNumberNegative = true;
            continue;
        }

        const currentOperatorIndex = operationStringCopy.search(mathOperatorsRegex);
        const currentOperator = operationStringCopy[currentOperatorIndex];

        for (let i = currentOperatorIndex + 1; i <= operationStringCopy.length - 1; i++) {
            if (allOperatorsRegex.test(operationStringCopy[i]) && i !== operationStringCopy.length - 1) {

                if (operationStringCopy[i] === "-" && isNaN(operationStringCopy[i - 1])) {
                    continue;
                }

                num2 = operationStringCopy.slice(currentOperatorIndex + 1, i);
                break;
            }
            if (i === operationStringCopy.length - 1) {
                num2 = operationStringCopy.slice(currentOperatorIndex + 1)
            }
        }

        for (let i = currentOperatorIndex - 1; i >= 0; i--) {

            if (allOperatorsRegex.test(operationStringCopy[i]) && i !== 0) {

                if (operationStringCopy[i] === "-" && isNaN(operationStringCopy[i - 1])) {
                    continue;
                }

                num1 = operationStringCopy.slice(i + 1, currentOperatorIndex)
                break;
            }
            if (i === 0) {
                num1 = operationStringCopy.slice(0, currentOperatorIndex)
                if (isFirstNumberNegative) {
                    num1 = "-" + num1;
                }
            }
        }

        let slicedString = num1 + currentOperator + num2;
        const result = primitiveCalc(num1, currentOperator, num2);

        if (isFirstNumberNegative) {
            isFirstNumberNegative = false;
            slicedString = slicedString.substring(1);
        }
        operationStringCopy = operationStringCopy.replaceAll(slicedString, result);
        operationStringCopy = operationStringCopy.replaceAll("+-", "-");
        operationStringCopy = operationStringCopy.replaceAll("--", "+");
    };

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





