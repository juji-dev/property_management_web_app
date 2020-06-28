var mongoose = require('mongoose');
var user = mongoose.model('user');

function createAdministrator() {
  try {
    user.findOneAndUpdate({ userName: "administrator" },
      { firstName: "administrator", userName: "administrator", secondName: "", pwd: "XXX_YOUR_PERMANENT_ADMIN_PASSWORD_XXX", admin: true },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      (err, response) => {
        if (err) {
          console.log("ERROR"); return;
        } else { console.log("Administrator Successfully added"); console.log(response) }
      });
  } catch (error) {
    console.log("Administrator not added");
  }
}

function createTestAcc() {
  try {
    user.findOneAndUpdate({ userName: "testUser" },
      { firstName: "James", userName: "testUser", secondName: "Jones", pwd: "XXX_YOUR_PERMANENT_TEST_USER_PASSWORD_XXX", admin: false },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      (err, response) => {
        if (err) {
          console.log("ERROR"); return;
        } else { console.log("testUser Successfully added"); console.log(response) }
      });
  } catch (error) {
    console.log("Test User not added");
  }
}

module.exports = {
  createAdministrator,
  createTestAcc
}
