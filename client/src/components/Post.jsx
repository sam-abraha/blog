import { formatISO9075 } from 'date-fns'

export default function Post({title, summary, cover, content, createdAt, author}) {

  console.log(cover)

    return (
        <div className="mt-2 grid grid-cols-2 gap-5 text-left p-10 max-w-screen-md ml-auto mr-auto ">
        <div className="col-span-1">
        <img src={'http://localhost:3000/'+cover}
          alt='' className="w-full max-h-full"></img>
        </div>
        <div className="col-span-1">
          <h2 className="font-bold text-[1.4rem] m-0">{title}</h2>
          <p className="text-gray-600 font-bold text-xs mt-1 mb-1 flex gap-1">
            <a>{author.name}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="flex text-gray-900 text-sm">{summary}
            </p>   
        </div>
        <div style={{ borderTop: "2px solid #d1d5db ", marginLeft: 10, marginRight: 10 }}></div>
      </div>
    )
}