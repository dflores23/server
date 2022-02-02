const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 3000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        },
        url: 'mongodb+srv://superuser:mateo0714@cluster1.stoim.mongodb.net/blog'
    },
    server: {
        host: 'localhost',
        port: 3000
    }
};

export default config;
