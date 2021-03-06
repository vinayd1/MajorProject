const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 8000
const web3 = new Web3('HTTP://127.0.0.1:7545');
const dbConfig = {
    host: 'remotemysql.com',
    user: 'Pv7mdzekq2',
    password: 'nLyfuAhSG4',
    database: 'Pv7mdzekq2'
}

const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);
const sqlTableQueries = {
    createAuthoritiesTable: `Create table if not exists Authority(AuthorityName varchar(100),PrivateKey varchar(100),PublicKey varchar(100));`
}

connection.connect(() => {
    console.log("<<<<Connected to mySQL database>>>>");
    connection.query(sqlTableQueries.createAuthoritiesTable, (err) => { if (err) throw err });
    app.listen(port, (err) => {
        if (err) {
            throw err
        } else console.log(`Server is running on port ${port}.`);
    });
});

app.post('/authority', async (req, res) => {
    const details = req.body.jsonObject;
    const authorityWallet = web3.eth.accounts.create();
    connection.query(`Insert into Authority(AuthorityName,PrivateKey,PublicKey) 
        values('${details.authorityName.replace(';', '')}', '${authorityWallet.privateKey}','${authorityWallet.address}');`,
        async (err, data) => {
            if (err) res.status(500).send(err);
            else res.status(200).send({ identity: details.identity })
        });
}).get('/authority', async (req, res) => {
    await connection.query(`Select AuthorityName, PublicKey from Authority`, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data);
        }
    })
});

const f = async (authority) => {
    const x = new Promise((res, rej) => {
        connection.query(`Select PrivateKey from Authority where PublicKey='${authority}';`, (err, data) => {
            if (err)
                rej(err);
            res(data[0] && data[0].PrivateKey);
        });
    });
    var query = await x;

    return query;
}

app.post('/sign', async (req, res) => {
    console.log(req.body)
    const rawData = req.body.attributes;
    const userPublicKey = req.body.userPublicKey;
    const signedData = [];

    for (const obj of rawData) {
        const authority = obj.authority;
        const key = obj.key;
        const value = obj.value;
        const privateKey = await f(authority);

        const data = {
            key,
            value,
            userPublicKey
        };

        signedData.push(
            {
                sign: web3.eth.accounts.sign(JSON.stringify(data), privateKey)
            }
        );
    }

    res.status(200).send(signedData);
});
