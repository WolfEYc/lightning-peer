
const homeLogin = () => {
    return(
        <div className="w-full max-w-xs">
  <form className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="Meeting ID">
        Meeting ID
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Meeting ID" type="text" placeholder="Meeting ID"/>
    </div>
    <div className="mb-6">
      <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="Name">
        Name
      </label>
      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="Name" type="Name" placeholder="Name"/>
    </div>
    <div className="flex items-center justify-between">
    <button className='rounded-lg border-2 <border-gray-800 border-pink-900 bg-gradient-to-r from-pink-800 to-gray-800 px-2 py-2'>Join Room</button>
    </div>
  </form>
</div>
    )
}

export default homeLogin;