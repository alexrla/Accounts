// Módulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// Core modules
import fs from 'fs';

const operations = () => {

    inquirer.prompt([

        {
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
        }

    ])
    .then((answer) => {

        const action = answer["action"];

        if(action === "Criar conta")    {

            createAccount();

        }

    })
    .catch((error) => console.log(error));

};

// Criar conta
function createAccount() {

    console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
    console.log(chalk.green("Defina as opções da sua conta, a seguir:"));


    buildAccount();

}

function buildAccount() {

    inquirer.prompt([
        {

            name: "accountName",
            message: "Digite um nome para a sua conta:"

        }
    ]).then((answer) => {

        const accountName = answer["accountName"];

        // console.info(accountName);

        // Criando o nosso "banco"
        if(!fs.existsSync("accounts"))  {

            fs.mkdirSync("accounts");

        }

        // Verificando se a conta já existe
        if(fs.existsSync(`accounts/${accountName}.json`)) {

            console.log(chalk.bgRed.black("Esta conta já existe, escolha outro nome!"));
            buildAccount();

            return;

        }

        // Criando a conta
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', (error) => {
            
            console.log(error);

        });

        console.log(chalk.green("Parabéns, a sua conta foi criada!"));
        
        operations();

    }).catch((error) => console.log(error));

}

operations();