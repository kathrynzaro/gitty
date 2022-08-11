const pool = require('../utils/pool');

module.exports = class Post {
  id;
  content;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.content = row.content;
    this.created_at = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT content, created_at FROM posts');
    return rows.map((row) => new Post(row));
  }
};
