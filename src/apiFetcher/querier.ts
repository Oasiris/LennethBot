import express from 'express'
import cors from 'cors'

/**
 * HTTP app.
 *
 * Instantiates and exports the Express app, which handles all HTTP endpoints.
 */

export class Querier {
    /** Singleton instance. */
    private static _instance: Querier

    port: string | number

    /**  */
    static get instance(): Querier {
        if (!Querier._instance) {
            Querier._instance = new Querier()
        }
        return this._instance
    }

    private constructor() {
        // Setup the app.
        const app = express()
        this.port = process.env.API_FETCHER_PORT || 8888
        app.set('port', this.port)

        // TODO: Finish setting up Express app.
    }
}
