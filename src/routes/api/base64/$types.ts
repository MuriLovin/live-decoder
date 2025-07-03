export interface Base64Request {
    action: 'encode' | 'decode';
    value: string;
}

export interface Base64Response {
    result: string;
}

export interface Base64ErrorResponse {
    error: string;
} 