import express from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'Home',
  });
});

router.get('/healthcheck', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'OK',
  });
});

export default router;
