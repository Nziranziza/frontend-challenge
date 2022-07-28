import { Model } from 'objection'
import Knex from 'knex'

// Initialize knex.
const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: 'app.db',
    },
})

// Give the knex instance to objection.
Model.knex(knex)

export class User extends Model {
    static get tableName() {
        return 'users'
    }
}

export async function createSchema() {
    if (await knex.schema.hasTable('users')) {
        return
    }

    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary()
        table.string('username')
        table.string('password')
    })
}
