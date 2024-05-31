import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Post({ id, title, summary, cover, createdAt, author }) {
  return (
    <div className="mt-8 max-w-screen-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <Link to={`/posts/${id}`}>
            <img
              src={`http://localhost:3000/${cover}`}
              alt={title}
              className="h-48 w-full object-cover md:h-full md:w-48"
            />
          </Link>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-lime-600 font-semibold">{author.name}</div>
          <Link
            to={`/posts/${id}`}
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {title}
          </Link>
          <time className="block text-gray-500 text-sm mt-1">{formatISO9075(new Date(createdAt))}</time>
          <p className="mt-2 text-gray-600">{summary}</p>
        </div>
      </div>
      <div className="border-t-2 border-gray-200 mt-4"></div>
    </div>
  );
}