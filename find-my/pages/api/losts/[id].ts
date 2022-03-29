import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/back/protectedHandler';
import client from '@libs/back/client';
import { withApiSession } from '@libs/back/session';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  try {
    const lost = await client.lost.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            scraps: true,
          },
        },
      },
    });
    const isScraped = Boolean(
      await client.scrap.findFirst({
        where: {
          lostId: lost?.id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      }),
    );

    return res.json({ ok: true, lost, isScraped });
  } catch (error) {
    return res.json({ ok: false, message: '예상치 못한 오류가 발생했습니다.' });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
