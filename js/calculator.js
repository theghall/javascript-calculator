// calculator.js

function convert(n) {
    if (n.indexOf('.') >= 0) {
        return parseFloat(n);
    } else {
        return parseInt(n,10);
    }
}

function mult(a, b) {
    return convert(a) * convert(b);
}

function div(a, b) {
    return convert(a) / convert(b);
}

function add(a, b) {
    return convert(a) + convert(b);
}

function sub(a,b) {
    return convert(a) - convert(b);
}

function calcOperands(stack) {
    var operand2 = stack.shift();
    var operator = stack.shift();
    var operand1 = stack.shift();
    var newOperand = 0;
    
    switch (operator) {
        case '*':
            newOperand = mult(operand1, operand2);
            break;
        case '/':
            newOperand = div(operand1, operand2);
            break;
        case '+':
            newOperand = add(operand1, operand2);
            break;
        case '-':
            newOperand = sub(operand1, operand2);
            break;
    }
    
    return newOperand.toString();
}

function total(stack) {
   var number = '0';
   
    while (stack.length > 1) {
        number = calcOperands(stack);
        
        stack.unshift(number);
    }
    
    return stack.shift();
}

function isNumber(keypress) {
    return !isNaN(keypress);
}

function allowDecimal(number) {
    var allow = (number.indexOf('.') < 0);
    
    return allow;
}

function calculator() {
    var cdisplay = $('#display');
    var currNumber = '';
    var lastOperation = '';
    var operationStack = [];

    $('.button').on('mousedown', function depress_key() {
        $(this).toggleClass('press');
    })
    
    $('.button').on('mouseup', function lift_key() {
        $(this).toggleClass('press');
    })
    
    
    $('.button').on('click', function display() {
        
        keypress = $(this).text();
        
        if (isNumber(keypress)) {
            currNumber += keypress;
            cdisplay.text(currNumber);
        } else {
            switch(keypress) {
                case '.':
                    if (allowDecimal(currNumber)) {
                        currNumber += keypress;
                        cdisplay.text(currNumber);
                    }
                    break;
                    
                case 'C':
                    currNumber = '';
                    lastOperation = '';
                    operationStack = [];
                    cdisplay.text('0');
                    break;
                case '*':
                case '/':
                    // by MDAS immediately calculate last Mult or Div
                    if (lastOperation === '*' || lastOperation === '/') {
                        operationStack.unshift(currNumber);
                        currNumber = calcOperands(operationStack);
                        operationStack.unshift(currNumber);
                        operationStack.unshift(keypress);
                        cdisplay.text(currNumber);
                        currNumber = '';
                    } 
                    // by MDAS need to wait for next number
                    else if (lastOperation === '+' || lastOperation === '-') {
                        operationStack.unshift(currNumber);
                        operationStack.unshift(keypress);
                        currNumber = '';
                    } 
                    else {
                        operationStack.unshift(currNumber);
                        operationStack.unshift(keypress);
                        currNumber = '';
                    }
                    lastOperation = keypress;
                    break;
                case '+':
                case '-':
                    // By MDAS do immediate calc
                    if (lastOperation === '+' || lastOperation === '-') {
                        operationStack.unshift(currNumber);
                        currNumber = calcOperands(operationStack);
                        operationStack.unshift(currNumber);
                        operationStack.unshift(keypress);
                        cdisplay.text(currNumber);
                        currNumber = '';
                    } 
                    // By MDAS need to calc the mult or div 
                    else if (lastOperation === '*' || lastOperation === '/') {
                        operationStack.unshift(currNumber);
                        currNumber = calcOperands(operationStack);
                        operationStack.unshift(currNumber);
                        cdisplay.text(currNumber);
                        currNumber = '';
                    } 
                    else {
                        operationStack.unshift(currNumber);
                        operationStack.unshift(keypress);
                        currNumber = '';
                    }
                    lastOperation = keypress;
                    break;
                case '=':
                    operationStack.unshift(currNumber);
                    currNumber = total(operationStack);
                    cdisplay.text(currNumber);
                    
                    currNumber = '';
                    lastOperation = '';
                    operationStack = [];
            }
        }
    }); 
}

$(document).ready(calculator);