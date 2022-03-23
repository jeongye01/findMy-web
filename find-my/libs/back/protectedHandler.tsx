import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
export default function protectedHandler(
  method: 'GET' | 'POST' | 'DELETE',
  func: (req: NextApiRequest, res: NextApiResponse) => void,
) {
  return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await func(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
