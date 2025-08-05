const NotFound = () => {
  return (
    <div className="h-screen flex flex-col  font-body justify-center items-center bg-baseColor text-mainColor px-6 text-center">
      <h1 className="text-9xl  font-extrabold">404</h1>
      <h2 className="text-3xl mt-4">Oops! Page Not Found</h2>
      <p className="mt-2 max-w-md text-lg">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-8 px-8 py-3 bg-white text-mainColor rounded-full shadow-lg hover:bg-mainColor hover:text-baseColor font-body transition-colors duration-300 font-semibold"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
