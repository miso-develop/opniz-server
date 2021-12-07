import { IOpnizServer } from "./IOpnizServer";
export declare class ServerCreator {
    static create(port: number, protocol?: ServerCreator.Protocol): IOpnizServer;
}
export declare namespace ServerCreator {
    const Protocol: {
        ws: string;
        http: string;
    };
    type Protocol = typeof Protocol[keyof typeof Protocol];
}
