import { ImCross } from "react-icons/im";

function SearchBar({ placeholder, label, searchItem, setSearchItem }) {
  return (
    <div className="w-full !mt-6 !mb-6 bg-white/40 backdrop-blur-sm rounded-xl shadow-md !p-4">
      <form className="flex flex-col gap-3">
        <label
          htmlFor="searchFilter"
          className="font-body font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          <input
            type="text"
            name="searchFilter"
            id="searchFilter"
            placeholder={placeholder}
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="w-full !px-4 !py-2.5 !pr-10 bg-white/70 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body text-gray-800"
          />
          <button
            type="button"
            onClick={() => setSearchItem("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <ImCross size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
