import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleLoginService = (usernameOrEmail, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(usernameOrEmail);
            if (isExist) {

                let user = await db.User.findOne({
                    attributes: ['email', 'role', 'password', 'name'],
                    where: { email: usernameOrEmail },
                    raw: true,

                });

                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Login succesfully';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = 'Wrong pasword';
                    }
                } else {
                    userData.errCode = 1;
                    userData.errMessage = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `User not found`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                    password: { [db.Sequelize.Op.ne]: '' }
                }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let saveUserPreferenceService = (userPreferenceData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userPreferenceData || !userPreferenceData.email || !userPreferenceData.stylePreference) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            } else {
                console.log("Check data: ", userPreferenceData);
                let user = await db.User.findOne({
                    where: {
                        email: userPreferenceData.email,
                    }
                })

                console.log("check user: ", user);

                if (user) {
                    await db.Favorite_style.create({
                        uid: user.id,
                        style: userPreferenceData.stylePreference,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save preference for user successfully!',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleLoginService: handleLoginService,
    saveUserPreferenceService: saveUserPreferenceService,
}