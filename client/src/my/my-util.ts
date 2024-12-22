export const JSON_replacer = (key: any, value: any) => {
    if (value instanceof Map) {
        // if (value.size === 0) return;
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    }
    return value;
}

export const JSON_reviver = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    if (["orderTime"].includes(key)) {
        return new Date(value);
    }
    return value;
}