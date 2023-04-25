const database = require("./database");

const getUsers = (req, res) => {

  const language = req.query.language;
  const city = req.query.city;
  let query = "select * from users";
  let params = [];

  if (language) {
    query += " where language = ?";
    params.push(language);
  }

  if (city) {
    if(params.length ===0) {
      query += " where city = ?";
    }else{
      query += " and city = ?";
    }
    
    params.push(language);
  }

  
  database
    .query(query,params)
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
  
    
  database
  .query(`select * from users where id= ${id}`)
  .then(([user]) => {
    if (user != null ) {
      res.json(user);
    } else {
      res.status(404).send("Not Found");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database")
  })

};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language} = req.body;

  database
  .query("INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",[firstname, lastname, email, city, language])
  .then(([result]) => {
    res.location(`/api/users/${result.insertId}`).sendStatus(201);
  })
   
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the user");
  });
};

     const putUser = (req, res) => {
        const id = parseInt(req.params.id);
        const { firstname, lastname, email, city, language } = req.body;
        database
          .query("update users set firstname= ?, lastname= ?, email=?, city= ?, language= ? WHERE id= ?", [firstname, lastname, email, city, language, id])
          .then(([result]) => {
            if (result.affectedRows === 0) {
              res.status(404).send("Not found");
            } else {
              res.sendStatus(204);
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the user");
          });
      };

      const deleteUser = (req, res) => {
        const id = parseInt(req.params.id);

        database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

module.exports = { getUsers, getUsersById, postUser, putUser, deleteUser, };