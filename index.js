const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// Neon PostgreSQL 연결 설정
// Render에 등록한 DATABASE_URL 환경변수를 자동으로 읽어옵니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon 접속 시 SSL 설정이 필요합니다.
  }
});

app.get('/', async (req, res) => {
  try {
    // 1. DB에서 레코드 하나만 조회 (LIMIT 1)
    // 테이블명이 'tast'라고 하셨으므로 그대로 반영합니다.
    const result = await pool.query('SELECT name FROM tast LIMIT 1');

    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`<h1>HELLO ${name}</h1>`);
    } else {
      res.send('<h1>HELLO WORLD</h1> (데이터가 테이블에 없습니다)');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 중 오류가 발생했습니다.');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
