const fs = require('fs')
const path = require('path')

const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env]

const db = {}

// Set the SQLite3 database file path
if (env === 'development') {
  config.storage = path.join(__dirname, '../../..', config.storage)
}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) &&
      (file !== 'index.js') &&
      (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db