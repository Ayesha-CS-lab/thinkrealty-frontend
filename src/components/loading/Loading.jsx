const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-5 h-5 bg-mainColor rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-6 h-6 bg-mainColor rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-5 h-5 bg-mainColor rounded-full animate-bounce [animation-delay:0.1s]"></div>
      </div>
    </div>
  );
};

export default Loading;
