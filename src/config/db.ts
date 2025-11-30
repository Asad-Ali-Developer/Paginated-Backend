

class MongoDBConfig {
    constructor(){}

    private getMongoDBUrl(): string {
        return process.env.MONGODB_URL || '';
    }

    public makeConnection(url: string) {
        
    }
}