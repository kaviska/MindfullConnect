// global.d.ts (or a custom types file in your project)
declare global {
  var mongoose: {
    conn: any;  // Change `any` to a more specific type if you prefer
    promise: Promise<any> | null;
  };
}

export {};
