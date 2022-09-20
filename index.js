// Módulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// Core modules
import fs from 'fs';

const operations = () => {

    inquirer.prompt([{

        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar conta",
            "Consultar saldo",
            "Depositar",
            "Sacar",
            "Sair"
        ]

    }])
    .then((answer) => {

        const action = answer["action"];

        console.log(action);

    })
    .catch((error) => console.log(error));

};

operations();