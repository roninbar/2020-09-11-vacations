const mysql = require('mysql2/promise');
const { hash } = require('../../util/hash');

async function addUser(username, password, firstname, lastname) {
  const conn = await mysql.createConnection({
    user: 'root',
    database: 'vacations',
  });
  try {
    const [{ insertId }] = await conn.execute({
      sql: `INSERT INTO \`user\` SET 
        \`name\` = :username, 
        \`password_hash\` = :passwordHash, 
        \`first_name\` = :firstname, 
        \`last_name\` = :lastname`,
      namedPlaceholders: true,
    }, {
      firstname,
      lastname,
      username,
      passwordHash: hash(password),
    });
    return insertId;
  }
  finally {
    await conn.end();
  }
}

exports.addUser = addUser;