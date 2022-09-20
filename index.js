// Módulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// Core modules
import fs from 'fs';

const operation = () => {

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

        } else if(action === "Depositar")   {

            deposit();

        } else if(action === "Consultar saldo") {

            getAccountBalance();

        } else if(action === "Sacar") {

            withdraw();

        } else if(action === "Sair") {

            console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));

            // Encerrando a execução do sistema
            process.exit();

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
        
        operation();

    }).catch((error) => console.log(error));

}

// Realizar depósito
function deposit()  {

    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta?"
        }
    ])
    .then((answer) => {

        const accountName = answer["accountName"];

        // Verificando a existência da conta
        if(!checkAccount(accountName))   {

            return deposit();

        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Quanto você deseja depositar?"
            }
        ])
        .then((answer) => {

            const amount = answer["amount"];

            // Adicionando valor
            addAmount(accountName, amount);

            operation();

        })
        .catch((error) => console.log(error));

    })
    .catch((error) => console.log(error));

}

function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`))  {

        console.log(chalk.bgRed.black("Esta conta não existe, escolha outra conta!"));

        return false;

    }

    return true; 

}

function addAmount(accountName, amount)    {

    const accountData = getAccount(accountName);

    // Verificando se o valor foi digitado
    if(!amount) {

        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"));
    
        return deposit();

    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (error) => console.log(error)
    );

    console.log(chalk.green(`Foi depositado, o valor de R$${amount} na sua conta`));

}

function getAccount(accountName)    {

    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, { encoding: "utf8", flag: "r" });

    return JSON.parse(accountJSON);

}

// Consultar saldo
function getAccountBalance()    {

    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta?"
        }
    ])
    .then((answer) => {

        const accountName = answer["accountName"];

        // Verificando a existência da conta
        if(!checkAccount(accountName))  {

            return getAccountBalance();

        }

        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData.balance}`
        ));

        operation();

    })
    .catch((error) => console.log(error));

}

// Sacar valor
function withdraw() {

    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta?"
        }
    ])
    .then((answer) => {

        const accountName = answer["accountName"];

        // Verificando a existência da conta
        if(!checkAccount(accountName))  {

            return withdraw();

        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Quanto você deseja sacar?"
            }
        ])
        .then((answer) => {

            const amount = answer["amount"];

            removeAmount(accountName, amount);

            operation();

        })
        .catch((error) => console.log(error));

    })
    .catch((error) => console.log(error));

}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName);

    // Verificando se o valor foi digitado
    if(!amount) {

        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"));

        return withdraw();
    }

    if(accountData.balance < amount)    {

        console.log(chalk.bgRed.black("Valor indisponível!"));

        return withdraw();

    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (error) => console.log(error)
    );

    console.log(
        chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`)
    );

}

operation();