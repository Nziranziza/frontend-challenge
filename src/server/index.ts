import {
    ApolloServerPluginCacheControl,
    ApolloServerPluginDrainHttpServer,
    gql,
} from 'apollo-server-core'
import { User, createSchema } from './db'
import express, { NextFunction, Request, Response } from 'express'
import { maxBy, sortBy } from 'lodash'
import passportLocal, { IVerifyOptions } from 'passport-local'

import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fetch from 'node-fetch'
import http from 'http'
import passport from 'passport'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import session from 'express-session'

const LocalStrategy = passportLocal.Strategy

let states: State[] | null = null

const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
    enum CacheControlScope {
        PUBLIC
        PRIVATE
    }

    directive @cacheControl(
        maxAge: Int
        scope: CacheControlScope
        inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

    type InterstateTradeForState @cacheControl(maxAge: 3600) {
        name: String
        amount: Float
    }

    type InterstateTradeSummary @cacheControl(maxAge: 3600) {
        name: String
        totalDollarAmount: Float
        totalTons: Float
        statesByDollars: [InterstateTradeForState]
        statesByTons: [InterstateTradeForState]
    }

    type IndustryByEmployeeSummary @cacheControl(maxAge: 3600) {
        industry: String
        employedCount: String
    }

    type IndustryByAverageSalarySummary @cacheControl(maxAge: 3600) {
        industry: String
        averageSalary: String
    }

    type EmploymentSummary @cacheControl(maxAge: 3600) {
        topIndustryByEmployee: IndustryByEmployeeSummary
        topIndustryByAverageSalary: IndustryByAverageSalarySummary
    }

    type ProductionSummary @cacheControl(maxAge: 3600) {
        name: String
        totalDollarAmount: Float
        totalTons: Float
        productionTypeByDollars: [InterstateTradeForState]
        productionTypeByTons: [InterstateTradeForState]
    }

    # State type
    type State @cacheControl(maxAge: 3600) {
        id: String
        key: String
        name: String
        slug: String
        tradeSummary: InterstateTradeSummary
        employmentSummary: EmploymentSummary
        productionSummary: ProductionSummary
    }

    type Query {
        states(name: String): [State]
    }
`

interface State {
    id: string
    key: string
    name: string
    slug: string
}

interface InterstateTradeSummary {
    'Millions Of Dollars': number
    'Thousands Of Tons': number
    Origin: string
    'ID Origin': string
    'Destination State': string // the description of what is being produced
    'ID Destination State': string
}

interface DataUsaEmploymentResult {
    'Industry Group': string
    'Total Population': number
    'Average Wage': number
    Geography: string
}

interface DataUsaProductionResult {
    SCTG2: string
    'Millions Of Dollars': number
    'Thousands Of Tons': number
    Origin: 'Virginia'
}

interface EmploymentSummary {
    topIndustryByEmployee: { industry: string; employedCount: number }
    topIndustryByAverageSalary: { industry: string; averageSalary: number }
}

interface InterstateTradeStateResult {
    name: string
    totalDollarAmount: number
    totalTons: number
    statesByDollars: { name: string; amount: number }[]
    statesByTons: { name: string; amount: number }[]
}

interface ProductionSummary {
    name: string
    totalDollarAmount: number
    totalTons: number
    productionTypeByDollars: { name: string; amount: number }[]
    productionTypeByTons: { name: string; amount: number }[]
}

const resolvers = {
    State: {
        tradeSummary: async (parent: State) => {
            const { id } = parent
            const response = await fetch(
                `https://datausa.io/api/data?Origin%20State=${id}&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=Destination%20State&year=latest`
            )
            const data: any = await response.json()
            const results: InterstateTradeSummary[] = data.data
            const totalTons = results.reduce(
                (totalTons, result) =>
                    (totalTons += result['Thousands Of Tons']),
                0
            )
            const totalDollarAmount = results.reduce(
                (totalTons, result) =>
                    (totalTons += result['Millions Of Dollars']),
                0
            )
            const statesByDollars = sortBy(
                results.map((result) => {
                    return {
                        name: result['Destination State'],
                        amount: result['Millions Of Dollars'],
                    }
                }),
                'amount'
            )
            const statesByTons = sortBy(
                results.map((result) => {
                    return {
                        name: result['Destination State'],
                        amount: result['Thousands Of Tons'],
                    }
                }),
                'amount'
            )

            return {
                name: parent.name,
                totalTons,
                totalDollarAmount,
                statesByDollars,
                statesByTons,
            } as InterstateTradeStateResult
        },
        employmentSummary: async (parent: State) => {
            const { id } = parent
            const response = await fetch(
                `https://datausa.io/api/data?Geography=${id}&measure=Total%20Population,Average%20Wage&drilldowns=Industry%20Group&Year=latest`
            )
            const data: any = await response.json()
            const results: DataUsaEmploymentResult[] = data.data
            const maxByEmployee = maxBy(results, (result) => {
                return result['Total Population']
            })
            const maxBySalary = maxBy(results, (result) => {
                return result['Average Wage']
            })

            return {
                topIndustryByAverageSalary: {
                    industry: maxBySalary?.['Industry Group'],
                    averageSalary: maxBySalary?.['Average Wage'],
                },
                topIndustryByEmployee: {
                    industry: maxByEmployee?.['Industry Group'],
                    employedCount: maxByEmployee?.['Total Population'],
                },
            } as EmploymentSummary
        },
        productionSummary: async (parent: State) => {
            const { id } = parent
            const response = await fetch(
                `https://datausa.io/api/data?Origin%20State=${id}&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=SCTG2&year=latest`
            )
            const data: any = await response.json()
            const results: DataUsaProductionResult[] = data.data
            const totalTons = results.reduce(
                (totalTons, result) =>
                    (totalTons += result['Thousands Of Tons']),
                0
            )
            const totalDollarAmount = results.reduce(
                (totalTons, result) =>
                    (totalTons += result['Millions Of Dollars']),
                0
            )
            const productionTypeByDollars = results.map((result) => {
                return {
                    name: result.SCTG2,
                    amount: result['Millions Of Dollars'],
                }
            })
            const productionTypeByTons = results.map((result) => {
                return {
                    name: result.SCTG2,
                    amount: result['Thousands Of Tons'],
                }
            })
            return {
                name: parent.name,
                totalTons,
                totalDollarAmount,
                productionTypeByDollars,
                productionTypeByTons,
            } as ProductionSummary
        },
    },
    Query: {
        states: async (parent: unknown, args: { name?: string }) => {
            const { name } = args
            if (states) {
                if (name) {
                    return states.filter((state: { name: string }) =>
                        state.name.toLowerCase().startsWith(name.toLowerCase())
                    )
                }
                return states
            } else {
                const response = await fetch(
                    'https://datausa.io/api/searchLegacy?dimension=Geography&hierarchy=State&limit=50000'
                )
                const data: any = await response.json()
                if (name) {
                    return data.results.filter((state: { name: string }) =>
                        state.name.toLowerCase().startsWith(name.toLowerCase())
                    )
                }
                states = data.results
                return data.results
            }
        },
    },
}

passport.deserializeUser(async (id: number, done) => {
    const user = await User.query().findById(id).execute()
    done(undefined, user)
})

passport.serializeUser((user, done) => {
    // @ts-ignore
    done(undefined, user.id)
})

passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' },
        async (username, password, done) => {
            const userStmt = await User.query()
                .where('username', '=', username)
                .where('password', '=', password)
                .execute()
            const user = userStmt[0]
            if (!user) {
                return done(undefined, false, {
                    message: 'Invalid credentials',
                })
            }

            return done(undefined, user)
        }
    )
)

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    await User.query().insert({ username, password }).execute()
    passport.authenticate(
        'local',
        (err: Error, user: User, info: IVerifyOptions) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.sendStatus(403)
            }
            return req.logIn(user, () => {
                return res.sendStatus(204)
            })
        }
    )(req, res, next)
}

const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        'local',
        (err: Error, user: User, info: IVerifyOptions) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.sendStatus(403)
            }
            return req.logIn(user, () => {
                const session = req.session
                // @ts-ignore
                session.userId = user.id
                return req.session.save(() => {
                    return res.sendStatus(204)
                })
            })
        }
    )(req, res, next)
}

const sessionHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(req.user || {})
}

async function startServer() {
    const app = express()
    app.use(bodyParser.json())
    app.use(
        cors({
            credentials: true,
            origin: [
                'http://localhost:3000',
                'https://studio.apollographql.com',
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        })
    )
    app.use(
        session({
            resave: true,
            saveUninitialized: true,
            secret: 'abc',
            name: 'test-app.sid',
            cookie: {
                sameSite: 'lax',
            },
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req, res, next) => {
        res.locals.user = req.user
        next()
    })
    app.post('/signup', signup)
    app.post('/login', login)
    app.get('/session', sessionHandler)
    const httpServer = http.createServer(app)
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
            getUser: () => req.user,
            logout: () => req.logout(),
        }),
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginCacheControl({ defaultMaxAge: 60 * 60 }), //one hour
            responseCachePlugin(),
        ],
    })
    await createSchema()
    await server.start()
    server.applyMiddleware({
        app,
    })
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve)
    )
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startServer()
