import status from 'http-status';
import userService from '../services/user-service.js';

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

const userController = { findAll };
export default userController;
