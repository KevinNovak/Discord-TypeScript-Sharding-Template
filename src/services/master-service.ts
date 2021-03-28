import { URL } from 'url';

import { HttpService } from '.';
import { LoginRequest, LoginResponse } from '../models/master-models';

let Config = require('../../config/config.json');

export class MasterService {
    constructor(private httpService: HttpService) {}

    public async login(): Promise<LoginResponse> {
        let body: LoginRequest = {
            callback: {
                url: Config.clustering.callbackUrl,
                token: Config.api.secret,
            },
            shardCount: Config.clustering.shardCount,
        };

        let res = await this.httpService.post(
            new URL(`/clusters/${Config.clustering.clusterId}`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token,
            body
        );

        if (!res.ok) {
            throw res;
        }

        return await res.json();
    }
}