import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    getHello(): any;
    constructor(appService: AppService);
    root(): {
        ok: boolean;
        message: string;
    };
}
