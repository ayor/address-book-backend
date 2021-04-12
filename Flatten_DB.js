module.exports =  FLATTEN_FIREBASE_DATA = (obj) => {
    const db_result = [];
    for (let [key, value] of Object.entries(obj)) {
        db_result.push({ id: key, ...value });
    }

    return db_result;
}