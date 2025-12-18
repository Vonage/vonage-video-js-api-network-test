export type FailureCase = {
    error?: {
        name: string;
        message?: string;
    };
    type?: string;
};

export type ConnectivityError = {
    failedTests?: FailureCase[];
};
