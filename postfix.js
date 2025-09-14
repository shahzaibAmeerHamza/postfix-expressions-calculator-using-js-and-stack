const readline = require("readline");

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.items.length === 0) {
            throw new Error("Stack underflow");
        }
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1] || null;
    }
}

class PostfixInterpreter {
    constructor() {
        this.stack = new Stack();
        this.symbolTable = {};
    }

    evaluate(expression) {
        let tokens = expression.split(" ");
        for (let token of tokens) {
            if (!isNaN(token)) { // Number
                this.stack.push(parseFloat(token));
            } else if ("+-*/".includes(token)) { // Operator
                let b = this.stack.pop();
                let a = this.stack.pop();
                this.stack.push(this.compute(a, b, token));
            } else if (token.match(/^[A-Z]$/)) { // Variable
                if (this.symbolTable[token] !== undefined) {
                    this.stack.push(this.symbolTable[token]); // Push stored value
                } else {
                    this.stack.push(token); // Treat as variable name for future assignment
                }
            } else if (token === "=") { // Assignment
                let value = this.stack.pop();
                let variable = this.stack.pop();

                if (typeof variable !== "string" || !variable.match(/^[A-Z]$/)) {
                    throw new Error("Invalid variable name");
                }

                this.symbolTable[variable] = value;
            } else if (token.toUpperCase() === "DELETE") { // DELETE operation
                let variable = this.stack.pop();

                if (typeof variable !== "string" || !variable.match(/^[A-Z]$/)) {
                    throw new Error("Invalid variable name for deletion");
                }

                delete this.symbolTable[variable];
            } else {
                throw new Error("Unknown token: " + token);
            }
        }
        return this.stack.peek();
    }

    compute(a, b, operator) {
        switch (operator) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
            default: throw new Error("Invalid Operator");
        }
    }

    displaySymbolTable() {
        console.log("Symbol Table:", this.symbolTable);
    }
}

// Setup command-line input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const interpreter = new PostfixInterpreter();

function getUserInput() {
    rl.question("Enter Postfix++ expression (type 'quit' to exit): ", (input) => {
        if (input.toLowerCase() === "quit") {
            console.log("Exiting Postfix++ Interpreter...");
            rl.close();
            return;
        }

        try {
            let result = interpreter.evaluate(input);
            console.log("Result:", result);
            interpreter.displaySymbolTable(); // Show updated symbol table
        } catch (error) {
            console.log("Error:", error.message);
        }
        getUserInput(); // Keep taking inputs
    });
}

console.log("Postfix++ Interpreter started. Type expressions to evaluate.");
console.log("Type 'quit' to exit.");
getUserInput();
