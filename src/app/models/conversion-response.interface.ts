export interface ConversionResponse {
    date: string;
    info : {
        timestamp: number;
        rate: number;
    };
    query: {
        from: string;
        to: string;
        amount: number
    };
    result: number;
    success: boolean;
    historical?: boolean;
}