import Memcached from "memcached";

export const memcached = new Memcached("127.0.0.1:11211");

memcached.stats((err, stats) => {
    if (err) console.error("Memcached not running:", err);
    else console.log("Memcached stats:", stats);
});
