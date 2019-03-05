const sqlite3 = require('sqlite3').verbose();


// TODO: make this persist for later, change memory to a db location
class Database {
  constructor() {
    // ':memory:'
    this.db = new sqlite3.Database('plasDB', (err) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log('Connected to the in-memory SQlite database.');
    });
  }

  query(sql, params=[]) {
    return new Promise((resolve, reject) => {

      this.db.run(sql,params, function(err){
        if(err){
          console.log("Error running sql " + sql)
          console.log(err)
          reject(err)
        }else{
          resolve({id:this.lastID})
        }
      })
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      db.close((err)=>{
        if(err){
          console.error(err.message);
        }
        console.log("Closed the database connection");
      })
    });
  }
  async showAllTables(){
    try{
      const sql= `SELECT name FROM sqlite_master WHERE type='table'`;
      const response = await database.query(sql);
      console.log("all tables ", response);
    }
    catch(error){
      throw error;

    }
  }
  async dropAllTables(){
    try{
      const dropPlasmid = `DROP TABLE IF EXISTS plasmids`
      const dropUsers = `DROP TABLE IF EXISTS users`
      const response1 = await database.query(dropPlasmid);
      const response2 = await database.query(dropUsers);
    console.log("Dropped all tables", response1, response2);

    }
    catch(error){
      throw error;
    }
  }
  async createTables() {
    // create users table
     try{
      const sql = `CREATE TABLE IF NOT EXISTS users(
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      PRIMARY KEY (username))`

      const response = await database.query(sql);
           console.log("created users table", response);

     }
     catch(error){
      throw error;
     }
     // create plasmids table
     try{
      const sql = `CREATE TABLE IF NOT EXISTS plasmids (
                   username TEXT NOT NULL,
                   sequence TEXT NOT NULL,
                   plasmidName TEXT NOT NULL,
                   interval INT,
                   minLength, INT,
                   annotations TEXT NOT NULL,
                   PRIMARY KEY (username, plasmidName),
                   FOREIGN KEY (username) REFERENCES users (username) 
                   ON DELETE CASCADE ON UPDATE NO ACTION
                  )`
      const response = await database.query(sql);
      console.log("created plasmids table", response);
     }
     catch(error){
      throw error;
     }
  }
}


const database = new Database();

module.exports = database;
