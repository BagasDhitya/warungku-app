import Memcached from "memcached";
const memcached = new Memcached("127.0.0.1:11211");

memcached.set("test_key", JSON.stringify({ hello: "world" }), 60, (err) => {
    if (err) return console.error("Set failed:", err);
    console.log("Set success");

    memcached.get("test_key", (err, data) => {
        if (err) return console.error("Get failed:", err);
        console.log("Get success:", data ? JSON.parse(data) : null);
    });
});
