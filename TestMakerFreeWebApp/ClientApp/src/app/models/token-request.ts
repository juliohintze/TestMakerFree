export class TokenRequest {
    username: string;
    password: string;
    grant_type: string;
    client_secret: string;
    client_id: string;
    scope: string;
    refresh_token: string;

    constructor() {
        this.grant_type = 'password';
        this.client_id = 'TestMakerFree';
        this.scope = 'offline_access profile email';
    }
}