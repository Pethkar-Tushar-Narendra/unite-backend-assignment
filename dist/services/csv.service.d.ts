import mongoose from 'mongoose';
interface CSVRow {
    name: string;
    phone: string;
    email: string;
    status?: string;
    source: string;
}
interface ProcessingResult {
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: Array<{
        row: number;
        data: CSVRow;
        error: string;
    }>;
}
export declare const CSVLog: mongoose.Model<{
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
}, mongoose.Document<unknown, {}, {
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        errors: mongoose.Types.DocumentArray<{
            error?: string | null;
            data?: any;
            row?: number | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            error?: string | null;
            data?: any;
            row?: number | null;
        }> & {
            error?: string | null;
            data?: any;
            row?: number | null;
        }>;
        filename?: string | null;
        uploadedAt?: NativeDate | null;
        totalRows?: number | null;
        successCount?: number | null;
        errorCount?: number | null;
        processedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        errors: mongoose.Types.DocumentArray<{
            error?: string | null;
            data?: any;
            row?: number | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            error?: string | null;
            data?: any;
            row?: number | null;
        }> & {
            error?: string | null;
            data?: any;
            row?: number | null;
        }>;
        filename?: string | null;
        uploadedAt?: NativeDate | null;
        totalRows?: number | null;
        successCount?: number | null;
        errorCount?: number | null;
        processedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    errors: mongoose.Types.DocumentArray<{
        error?: string | null;
        data?: any;
        row?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        error?: string | null;
        data?: any;
        row?: number | null;
    }> & {
        error?: string | null;
        data?: any;
        row?: number | null;
    }>;
    filename?: string | null;
    uploadedAt?: NativeDate | null;
    totalRows?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    processedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const processCSVData: (csvData: string, filename: string) => Promise<ProcessingResult>;
export {};
//# sourceMappingURL=csv.service.d.ts.map