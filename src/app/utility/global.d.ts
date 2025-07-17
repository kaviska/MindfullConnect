declare global {
    var mongoose: {
        conn: any;  // Change `any` to a more specific type if you prefer
        promise: Promise<any> | null;
    };
}

export { };