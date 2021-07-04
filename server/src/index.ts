import "dotenv/config"
import { User } from "./entity/User";
import express from 'express';
import { UserResolver } from './UserResolver';
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser'
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import cors from 'cors';

(async () => {
    const app = express();
    await createConnection();

    app.use(cookieParser())

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))

    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ ok: false, accessToken: '' });
        }
        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);

        } catch (e) {
            console.log(e)
            return res.send({ ok: false, accessToken: '' });
        }

        const user = await User.findOne({ id: payload.userId });

        if (!user) {
            return res.send({ ok: false, accessToken: '' });
        } else {

            if (user.tokenVersion !== payload.tokenVersion) {
                return res.send({ ok: false, accessToken: '' });
            }

            sendRefreshToken(res, createRefreshToken(user));
            return res.send({ ok: true, accessToken: createAccessToken(user) })
        }

    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    })

    apolloServer.applyMiddleware({ app, cors: false });


    app.listen(4000, () => {
        console.log('Express Server Started!')
    });

})();

