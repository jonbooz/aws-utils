import * as _ from 'lodash';

export = AwsUtils;

declare class AwsUtils {
    constructor(provideCredentials?: boolean, region?: string, profile?: string);

    useService(serviceName: string): void;

    call(serviceName: string, method: string, params: any): Promise<any>;

    listStackResources(stackName: string): Promise<_.Dictionary<string>>;

    ddb: AwsUtils.DynamoDB;
    ses: AwsUtils.SES;
}

declare namespace AwsUtils {
    export class DynamoDB {
        _register(aws: AwsUtils): void;

        save(table: string, object: any): Promise<any>;

        read(table: string, key: any): Promise<any>;

        scan(table: string, expression: string, values: _.Dictionary<any>, names: _.Dictionary<string>): _.Dictionary<any>[];
    }

    export class SES {
        _register(aws: AwsUtils): void;

        sendEmail(subject: string, messageBody: string, source: string, recipients: [string]): Promise<any>;
    }
}