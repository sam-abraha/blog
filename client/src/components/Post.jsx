export default function Post() {
    return (
        <div className="mt-2 grid grid-cols-2 gap-5 text-left p-10 max-w-screen-md ml-auto mr-auto ">
        <div className="col-span-1">
          <img src="https://techcrunch.com/wp-content/uploads/2024/02/IMG_0247.jpeg?resize=1536,1152"
          className="w-full max-h-full"></img>
        </div>
        <div className="col-span-1">
          <h2 className="font-bold text-[1.4rem] m-0">Google adds live threat detection and screen-sharing protection to Android</h2>
          <p className="text-gray-600 font-bold text-xs mt-1 mb-1 flex gap-1">
            <a>Ivan Metha</a>
            <time>04-15-2024 10am</time>
          </p>
          <p className="flex text-gray-900 text-sm">Google said on Wednesday that it is adding new security and privacy protections to Android,
            including on-device live threat detection to catch malicious apps, 
            new safeguards and security against cell site simulators.
            </p>   
        </div>
        <div style={{ borderTop: "2px solid #d1d5db ", marginLeft: 10, marginRight: 10 }}></div>
      </div>
    )
}