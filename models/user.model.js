const dbConnection = require('../config/database');
const table = 'user';

// GET USER BY ID
exports.getUsersById = async (id) => {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    try {
        const result = await dbConnection.query(sql, [id]);
        return result;
    } catch (err) {
        throw err;
    }
};

// GET USER BY CONDITION
exports.getUsersByCondition = async (cond) => {
    const sql = `SELECT * FROM ${table} WHERE ${Object.entries(cond)
        .map(([key, value]) => `${key} = ?`)
        .join(' AND ')}`;
    const values = Object.values(cond);
    console.log(sql, values);

    try {
        const result = await dbConnection.query(sql, values);
        return result[0];
    } catch (err) {
        throw err;
    }
};

// CREATE USER
exports.createUser = async (data) => {
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${table} (${keys.join()}) VALUES ?`;
    const values = [Object.values(data)];
    console.log(sql, values);

    try {
        const result = await dbConnection.query(sql, [values]);
        return result;
    } catch (err) {
        throw err;
    }
};

// UPDATE USER
exports.updateUser = async (id, data) => {
    const sql = `UPDATE ${table} SET ? WHERE id = ?`;
    const values = [data, id];

    try {
        const result = await dbConnection.query(sql, values);
        return result;
    } catch (err) {
        throw err;
    }
};
