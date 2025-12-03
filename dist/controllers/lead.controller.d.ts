import { Request, Response } from 'express';
export declare const createLead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllLeads: (req: Request, res: Response) => Promise<void>;
export declare const getLeadById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=lead.controller.d.ts.map