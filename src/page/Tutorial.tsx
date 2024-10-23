export default function Tutorial() {
    return (
      <div className="w-screen flex justify-center my-5 bg-gray-800 p-10">
        <div className=" w-[100%] mt-20 md:my-10 cmd:w-[50%] h-[60vh] m-2 p-4 rounded-md flex justify-center items-center">
          <iframe
            src="https://www.youtube.com/embed/_kS1bsKjz1A"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
            className="h-[300px] h-[70vh] w-[70%]  rounded-md"
          />
        </div>
      </div>
    );
  }
  
//   <iframe width="853" height="480" src="" title="How to add UPSTOX account in Cliq2Trade" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>