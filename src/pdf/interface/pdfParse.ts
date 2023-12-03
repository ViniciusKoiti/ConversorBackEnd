export interface PDFParse {
    numpages: number; 
    numrender: number; 
    info: {
        [key: string]: any; 
    };
    metadata?: {
        [key: string]: any; 
    };
    version: string;  
    text: string; 
}
