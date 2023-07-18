import authService from '../services/auth-service.js';

const register = async (req, res, next) => {
  try {
    const { body: request } = req;
    const result = await authService.register(request);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { body: request, session } = req;
    const result = await authService.login(session, request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const { email } = req.user;

    const result = await authService.me(email);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { session } = req;
    await authService.logout(session);

    res.status(200).json({
      data: 'OK',
    });
  } catch (e) {
    next(e);
  }
};

export default { register, login, me, logout };
