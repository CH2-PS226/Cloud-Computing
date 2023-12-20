// catoraUser.js
const Sequelize = require('sequelize');
const connection = require('../../db');

const CatoraUser = connection.define('catora_user', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  password_hash: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = CatoraUser;
