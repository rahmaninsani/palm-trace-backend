import status from 'http-status';
import userService from '../services/user-service.js';

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await userService.update(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const userType = req.query.userType;
    const request = { userType };

    const result = await userService.findAll(request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await userService.findOneProfil(user);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const userController = { update, findAll, findOne };
export default userController;
