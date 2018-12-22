import * as _ from 'lodash';

export = AwsUtils;

declare class AwsUtils {
    constructor(profile?: string, region?: string);

    useService(serviceName: string): void;

    call(serviceName: string, method: string, params: any): Promise<any>;

    listStackResources(stackName: string): Promise<_.Dictionary<string>>;

    ddb: AwsUtils.DynamoDB;
}

declare namespace AwsUtils {
    export class DynamoDB {
        _register(aws: AwsUtils): void;

        save(table: string, object: any): Promise<any>;

        read(table: string, key: any): Promise<any>;

        scan(table: string, expression: string, values: _.Dictionary<any>, names: _.Dictionary<string>): _.Dictionary<any>[];
    }
}