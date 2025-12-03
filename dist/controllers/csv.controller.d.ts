import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const uploadCSVMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadCSV: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCSVLogs: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=csv.controller.d.ts.map