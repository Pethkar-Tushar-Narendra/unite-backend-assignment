import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const createCallTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeCallTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllCallTasks: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=callTask.controller.d.ts.map