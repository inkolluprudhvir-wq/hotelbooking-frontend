import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>

      <input
        type="text"
        placeholder="Search hotels by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          type="button"
          className="search-clear"
          onClick={() => setSearch("")}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
