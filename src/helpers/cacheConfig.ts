import Memcached from "memcached";

const memcached = new Memcached("127.0.0.1:11211"); // pastikan host & port sesuai

export function getCache(key: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
            if (err) return reject(err);
            if (!data) return resolve(null);
            try {
                resolve(JSON.parse(data));
            } catch {
                resolve(null);
            }
        });
    });
}

export function setCache(key: string, value: any, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
        memcached.set(key, JSON.stringify(value), ttl, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}
