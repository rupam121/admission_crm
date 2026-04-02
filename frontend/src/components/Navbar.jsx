import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-900 text-white px-6 py-3 flex items-center gap-10">
      <Link to="/dashboard" className="px-3 py-1 rounded hover:bg-gray-700">
        Dashboard |
      </Link>

      <Link to="/programs" className="px-3 py-1 rounded hover:bg-gray-700">
        Programs |
      </Link>

      <Link to="/applicants" className="px-3 py-1 rounded hover:bg-gray-700">
        Applicants |
      </Link>

      <Link to="/allocate" className="px-3 py-1 rounded hover:bg-gray-700">
        Allocate |
      </Link>

      <Link to="/apply" className="px-3 py-1 rounded hover:bg-gray-700">
        Apply |
      </Link>
    </div>
  );
}
