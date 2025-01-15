import { Transform } from "class-transformer";

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

const formatTime = (time?: Date | null | undefined): string => {
    const date = time || new Date();
    return date.toLocaleString('en-CA', { hour12: false }) + ':' + date.getMilliseconds();
}

const TransformTime = () => {
    const toPlain = Transform(value => formatTime(value.value), {
        toPlainOnly: true,
    });

    const toClass = Transform((value) => new Date(value.value), {
        toClassOnly: true,
    });

    return function (target: any, key: string) {
        toPlain(target, key);
        toClass(target, key);
    };
}

export const UTILS = {
    formatTime,
    TransformTime
}