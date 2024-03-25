const NoPage = () => {
  return (
    <div className="flex flex-col text-center py-32 h-screen">
      <span className="text-primary text-xl font-bold">404</span>
      <span className="text-5xl text-white font-black py-2">
        Page not found
      </span>
      <span className="text-lg text-bodyText">
        Sorry! We couldn&apos;t find the page you&apos;re looking for.
      </span>
    </div>
  );
};

export default NoPage;
