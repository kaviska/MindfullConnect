export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 my-6 text-sm text-gray-600">
      <button className="px-3 py-1 rounded bg-gray-100">Previous</button>
      <button className="px-3 py-1 rounded bg-indigo-600 text-white">1</button>
      <button className="px-3 py-1 rounded bg-gray-200">2</button>
      <button className="px-3 py-1 rounded bg-gray-200">3</button>
      <button className="px-3 py-1 rounded bg-gray-100">Next</button>
    </div>
  );
}
