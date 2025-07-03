export const encodeBase64 = (value: string) => {
    const buffer = Buffer.from(value, 'utf8')
    return buffer.toString('base64')
}

export const decodeBase64 = (value: string) => {
    const buffer = Buffer.from(value, 'base64')
    return buffer.toString('utf8')
} 