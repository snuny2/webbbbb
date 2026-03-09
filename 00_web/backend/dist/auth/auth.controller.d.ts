import express from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(body: {
        userId: string;
        password: string;
    }, res: express.Response): Promise<{
        success: boolean;
        user: {
            id: number;
            name: string;
            userId: string;
        };
    }>;
    logout(res: express.Response): {
        success: boolean;
        message: string;
    };
    refresh(body: any, res: express.Response): Promise<{
        success: boolean;
    }>;
}
