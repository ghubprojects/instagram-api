const dbConnection = require('../config/database');
const table = 'users';

// GET USER BY ID
exports.getUsersById = async (id) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    try {
        const result = await dbConnection.query(query, [id]);
        return result;
    } catch (err) {
        throw err;
    }
};

// GET USER BY CONDITION
exports.getUsersByCondition = async (cond) => {
    const query = `SELECT * FROM ${table} WHERE ${Object.entries(cond)
        .map(([key, value]) => `${key} = ?`)
        .join(' AND ')}`;
    const values = Object.values(cond);

    try {
        const result = await dbConnection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    }
};

// CREATE USER
exports.createUser = async (data) => {
    const keys = Object.keys(data);
    const query = `INSERT INTO ${table} (${keys.join()}) VALUES ?`;
    const values = [Object.values(data)];

    try {
        const result = await dbConnection.query(query, [values]);
        return result;
    } catch (err) {
        throw err;
    }
};

// UPDATE USER
exports.updateUser = async (id, data) => {
    const query = `UPDATE ${table} SET ? WHERE id = ?`;
    const values = [data, id];

    try {
        const result = await dbConnection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    }
};
