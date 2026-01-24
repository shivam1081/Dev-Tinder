const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Strong Enough");
  }
};

// Schema Method tp validate the profile update fields
const validateProfileData = (req) => {
  // Checking the fields that are allowed to edit.
  const allowedEditFields = [
    "about",
    "age",
    "firstName",
    "gender",
    "lastName",
    "photoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields?.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateProfileData, validateSignUpData };
