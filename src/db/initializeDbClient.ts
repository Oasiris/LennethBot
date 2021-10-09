const uri =
    `mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}` +
    `@${process.env.DB_MONGO_CLUSTER_URL}?retryWrites=true&w=majority`
