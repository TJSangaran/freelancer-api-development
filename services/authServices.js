const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/email");
const config = require("../config/keys");
const { makeUid } = require("../utils/utils");
const StreamClient = require("../utils/streamClient");

exports.signup = async ({
  firstname,
  lastname,
  email,
  password,
  phone,
  description,
  tags,
  address,
  dob,
  isErrand,
  readyToWork,
  accountnumber,
  accountname,
  bankname,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const profileColor = Math.floor(Math.random() * 10) + 1;
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    phone,
    description,
    tags,
    address,
    dob,
    isErrand,
    readyToWork,
    accountnumber,
    accountname,
    bankname,
    profileColor,
  });
  delete user?._doc?.password;

const streamClient = new StreamClient();
await streamClient.createUser(user.id, firstname, lastname);
  return user;
};

exports.login = async (email, password, rememberMe) => {
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const encryptedUser = {
      user: {
        _id: user.id,
        email: user.email,
      },
      type: "authorization",
      role: "user",
    };

    // Create User Token
    const streamUserToken = new StreamClient().getToken(user.id);

    return {
      accessToken: generateAccessToken(encryptedUser),
      refreshToken: generateRefreshToken(encryptedUser, rememberMe),
      streamToken: streamUserToken,
      user: {
        _id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    };
  } else {
    throw new Error("Invalid credientials");
  }
};

exports.tokenRefresh = (refreshToken) => {
  try {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    delete decodedUser.exp;
    delete decodedUser.iat;
    const accessToken = generateAccessToken(decodedUser);
    return accessToken;
  } catch (error) {
    console.log(error);
    throw { success: false, error: error.message, statusCode: 401 };
  }
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    const OTP = makeUid(6);
    const expiration = 30;
    const expirationTime = Date.now() + expiration * 60 * 1000;
    // const accountRecovery = {
    //     token: OTP,
    //     expirationTime
    // }
    // const result = await User.updateOne({ _id: user._id }, {
    //     $set: { accountRecovery }
    // })
    user.accountRecovery = {
      OTP: OTP,
      expirationTime,
    };
    await user.save();

    const resetUrl =
      config.FROENTEND_DOMAIN +
      "/" +
      config.PASSWORD_RESET_PATH +
      "/" +
      email +
      "/" +
      OTP;

    console.log(resetUrl);
    const params = {
      to: email,
      subject: "Password recovery",
      title: "Account Password Recovery",
      text: "Your password reset vertification code is " + OTP,
      html:
        `<h5>Your OTP is ${OTP}</h5>
                <div>Please reset your password using this link  ` +
        `<a href="${resetUrl}">${resetUrl}</a>` +
        `</div>`,
    };

    return sendMail(params, (err, response) => {
      console.log(JSON.stringify({ err, response }, null, 2));
      if (err) throw new Error("Cannot send email");
      return `Reset email sent to ${
        response && response.accepted && response.accepted[0]
      }`;
    });
  } else {
    console.log("Email not found");
    throw new Error("Email not found");
  }
};

// exports.getTokenDetail = async ({ email, OTPVerified }) => {
//     return {
//         email,
//         OTPVerified
//     }
// }

exports.verifyOTP = async ({ email, OTP }) => {
  try {
    const user = await User.findOne({ email });

    if (user.accountRecovery && user.accountRecovery.OTP === OTP) {
      return "Valid OTP";
    } else {
      throw new Error("Not valid credientials");
    }
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async ({ email, OTP, newPassword }) => {
  try {
    const user = await User.findOne({ email });

    if (user.accountRecovery && user.accountRecovery.OTP === OTP) {
      if (
        user.accountRecovery.expirationTime &&
        user.accountRecovery.expirationTime > Date.now()
      ) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.accountRecovery = { OTP: null, expirationTime: null };
        await user.save();
        // const result = await User.updateOne({ _id: user._id }, {
        //     $set: { password: hashedPassword, accountRecovery: { OTP: null, expirationTime: null } }
        // })
        return "Password Changed";
      } else {
        console.log("Reset Token expired");
        throw new Error("Reset Token expired");
      }
    } else {
      console.log("Not valid credientials");
      throw new Error("Not valid credientials");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.logout = (userId) => {};

const generateAccessToken = (object) => {
  return jwt.sign(object, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (object, rememberMe) => {
  return jwt.sign(object, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: rememberMe ? "4w" : "5d",
  });
};
