const express = require("express")
const routesFuncionario = require("./routes/funcionarioRouter")
const routesProduto = require("./routes/protudoRouter")
const sequelize = require("./config/database")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.use(routesFuncionario)
app.use(routesProduto)



module.exports = app