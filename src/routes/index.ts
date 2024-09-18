import { eq } from 'drizzle-orm';
import express from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';

import { db } from '#src/drizzle/index.ts';
import { redirects } from '#src/drizzle/schema/redirects.ts';

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

    res.status(httpStatus.OK).json(result)
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

router.get('/healthcheck', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'OK',
  });
});

export default router;
