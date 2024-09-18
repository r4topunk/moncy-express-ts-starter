import { eq } from 'drizzle-orm';
import express from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';

import { db } from '#src/drizzle/index.ts';
import { redirects } from '#src/drizzle/schema/redirects.ts';
import { decodeJWT, encodeJWT } from '#src/utils/JWTRoutes.ts';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'Home',
  });
});

router.get('/routes', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(redirects)

    const ans = result.map(row => ({
      ...row,
      link: `http://localhost:9500/redirect/jwt/${encodeJWT({ uuid: row.uuid })}`
    }))

    res.status(httpStatus.OK).json(ans)
  } catch (error) {

  }
})

router.get('/redirect/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    const result = await db
      .select()
      .from(redirects)
      .where(eq(redirects.uuid, uuid));

    if (result.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Redirect not found',
      });
    }

    return res.redirect(result[0].url);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred',
    });
  }
});

router.get('/redirect/jwt/:jwt', async (req, res) => {
  interface CustomRequest extends Request {
    token: string | JwtPayload;
  }
  try {
    const { uuid } = decodeJWT(req.params.jwt)

    const result = await db
      .select()
      .from(redirects)
      .where(eq(redirects.uuid, uuid as string));

    if (result.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Redirect not found',
      });
    }

    return res.redirect(result[0].url);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred',
    });
  }
});

router.get('/healthcheck', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'OK',
  });
});

export default router;
