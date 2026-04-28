import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Remove password from user object
  let userObj;
  if (user.toObject) {
    userObj = user.toObject();
    delete userObj.password;
  } else {
    userObj = { ...user };
    delete userObj.password;
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj,
  });
};
